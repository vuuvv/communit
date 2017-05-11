import * as _ from 'lodash';

import { router, get, post, success, Response, ResponseError, login } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody, errorPage } from '../utils';
import { Account, Product, Qrcode, QrcodeAction, OrderType, Order, OrderStatus, Store, OrderDetail } from '../models';
import { deductPoints, TransactionType } from '../account';
import { Wechat } from '../wechat';
import { Config } from '../config';

interface BuyProduct {
  productId: string;
  count: number;
}

@router('/order')
export class OrderController {
  @post('/buy/product')
  @login
  async buy(ctx) {
    let userId = ctx.session.userId;
    let communityId = ctx.session.communityId;
    let p: BuyProduct = await getJsonBody(ctx);
    if (!p.productId) {
      throw new Error('请传入商品Id');
    }
    if (p.count < 1) {
      throw new Error('购买的商品数量必须大于1');
    }

    let product: Product = await Table.Product.where('id', p.productId).first();
    if (!product) {
      throw new Error('无效的商品Id');
    }
    if (product.status !== 'online') {
      throw new Error('该商品不可购买');
    }

    let store: Store = await Table.Store.where('id', product.storeId).first();
    if (!store || store.status !== 'normal') {
      throw new Error('该商品所属店铺已关闭， 不可购买');
    }

    if (store.communityId !== communityId) {
      throw new Error('该商品所属店铺不属于本社区，不可购买');
    }

    let order = new Order();
    order.type = OrderType.Product;
    order.communityId = communityId;
    order.sellerId = product.storeId;
    order.buyerId = userId;
    order.status = OrderStatus.Payed;
    order.amount = product.points * Math.ceil(p.count);
    order.orderTime = order.payTime = new Date();

    let detail = new OrderDetail();
    detail.orderId = order.id;
    detail.type = OrderType.Product;
    detail.productId = product.id;
    detail.data = JSON.stringify(product);
    detail.points = product.points;

    await db.transaction(async (trx) => {
      order.buyerTradeTransactionId = await deductPoints(
        trx, communityId, order.buyerId, TransactionType.PayProduct, order.amount, order.id
      );

      await Table.Order.transacting(trx).insert(order);
      await Table.OrderDetail.transacting(trx).insert(detail);
    });

    return success(order);
  }

  @get('/store')
  @login
  async storeOrderList(ctx) {
    let userId = ctx.session.userId;
    let communityId = ctx.session.communityId;
    let ret;
    let orders = await raw(`
    select o.*, s.name from t_order as o
    join t_store as s on o.sellerId = s.id
    where s.userId = ? and s.communityId = ?
    order by o.updatedAt desc
    `, [userId, communityId]);

    if (!orders.length) {
      return success([]);
    }

    let details: any[] = await raw(`
    select * from t_order_detail where orderId in (?)
    `, [orders.map((v) => v.id)]);

    for (let o of orders) {
      o.details = details.filter((d) => o.id === d.orderId);
    }

    return success(orders);
  }

  @get('/list/:type')
  @login
  async orderList(ctx) {
    let userId = ctx.session.userId;
    let ret;
    if (ctx.params.type === OrderType.Product) {
      let orders = await raw(`
      select o.*, s.name from t_order as o
      join t_store as s on o.sellerId = s.id
      where o.buyerId = ? and o.type = ?
      order by o.updatedAt desc
      `, [userId, OrderType.Product]);

      if (!orders.length) {
        return success([]);
      }

      let details: any[] = await raw(`
      select * from t_order_detail where orderId in (?)
      `, [orders.map((v) => v.id)]);

      for (let o of orders) {
        o.details = details.filter((d) => o.id === d.orderId);
      }

      ret = orders;
    } else if (ctx.params.type === OrderType.Activity) {
      let orders = await raw(`
      select
        o.*, od.data, if(wu1.userId=s.userId, wu2.realname, wu1.realname) as name,
        wa.accountname as communityName, sc.name as categoryName,
        od.points as points, s.userId as ownerId
      from t_order as o
      join t_order_detail as od on o.id = od.orderId
      left join t_wechat_user as wu1 on wu1.officialAccountId = o.communityId and wu1.userId = o.buyerId
      left join t_wechat_user as wu2 on wu2.officialAccountId = o.communityId and wu2.userId = o.sellerId
      left join weixin_account as wa on wa.id = o.buyerId
      left join t_service_user as su on od.productId = su.id
      left join t_service as s on su.serviceId = s.id
      left join t_service_category as sc on s.categoryId = sc.id
      where o.communityId = ? and (o.buyerId = ? or o.sellerId = ?) and o.type in ('service', 'activity')
      `, [ctx.session.communityId, userId, userId]);

      ret = orders;
    }
    return success(ret);
  }

  @get('/:type/list')
  @login
  async List(ctx) {
    let userId = ctx.session.userId;
    if (ctx.params.type === 'store') {
      let store = await Table.Store.where({
        communityId: ctx.session.communityId,
        userId: ctx.session.userId,
      }).first();

      if (!store) {
        throw new Error('您还未开店，没有店铺订单');
      }

      userId = store.id;
    }
    let transactions = await raw(`
    select t.*, tt.name as typeName from t_transaction as t
    join t_transaction_type as tt on t.typeId = tt.id
    where communityId = ? and userId = ?
    order by t.createdAt desc
    `, [ctx.session.communityId, userId]);

    if (!transactions || !transactions.length) {
      return success(transactions);
    }

    let tids = transactions.map(t => t.id);

    let orders: any[] = await raw(`
    select * from t_order
      where
        buyerTradeTransactionId in (?) or
        sellerTradeTransactionId in (?) or
        buyerRefundTransactionId in (?) or
        sellerRefundTransactionId in (?)
    `, [tids, tids, tids, tids]);

    let details: any[] = await raw(`
    select * from t_order_detail where orderId in (?)
    `, [orders.map((v) => v.id)]);

    for (let o of orders) {
      o.details = details.filter((d) => o.id === d.orderId);
    }

    for (let t of transactions) {
      // for (let o of orders) {
      //   if (o.buyerTradeTransactionId === t.id) {
      //     t.order = o;
      //     break;
      //   }
      // }
      t.order = _.find(orders, (o) =>
        o.buyerTradeTransactionId === t.id ||
        o.sellerTradeTransactionId === t.id ||
        o.buyerRefundTransactionId === t.id ||
        o.sellerRefundTransactionId === t.id
      );
    }

    return success(transactions);
  }
}
