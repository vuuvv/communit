import * as _ from 'lodash';

import { router, get, post, success, Response, ResponseError, login } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody, errorPage } from '../utils';
import { Account, Product, Qrcode, QrcodeAction } from '../models';
import { Wechat } from '../wechat';
import { Config } from '../config';

@router('/order')
export class OrderController {
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
