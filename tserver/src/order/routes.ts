import * as _ from 'lodash';

import { router, get, post, success, Response, ResponseError, login } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody, errorPage } from '../utils';
import { Account, Product, Qrcode, QrcodeAction } from '../models';
import { Wechat } from '../wechat';
import { Config } from '../config';

@router('/order')
export class OrderController {
  @get('/buyer/list')
  @login
  async orderListByBuyer(ctx) {
    let orders: any[] = await raw(`
    select * from t_order where communityId = ? and buyerId = ?
    `, [ctx.session.communityId, ctx.session.userId]);
    let details: any[] = await raw(`
    select * from t_order_detail where orderId in (?)
    `, [orders.map((v) => v.id)]);
    for (let o of orders) {
      o.details = details.filter((d) => o.id === d.orderId);
    }
    return success(orders);
  }

  @get('/seller/list')
  @login
  async orderListBySeller(ctx) {
    let ret = await raw(`
    select * from t_order where communityId = ? and sellerId = ?
    `, [ctx.session.communityId, ctx.session.userId]);
    return success(ret);
  }

  @get('/list')
  @login
  async List(ctx) {
    let transactions = await raw(`
    select t.*, tt.name as typeName from t_transaction as t
    join t_transaction_type as tt on t.typeId = tt.id
    where communityId = ? and userId = ?
    order by t.createdAt desc
    `, [ctx.session.communityId, ctx.session.userId]);

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
