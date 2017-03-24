import { router, get, post, success, Response, ResponseError, login, wechat, api } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody } from '../utils';
import { Account, Order, OrderType, OrderDetail, OrderStatus } from '../models';

import { addPoints, deductPoints, AccountType, TransactionType, PayActivity, PayCommunity } from '../account';

async function getWechatUser(officialAccountId, userId) {
  return await Table.WechatUser.where({officialAccountId, userId}).first();
}

interface PayToCommunity {
  communityId: string;
  points: number;
}

interface PayToActivityUser{
  activityUserId: string;
  points: number;
}

@router('/api')
export class ApiController {
  @post('/points/give/community')
  @api
  async pointsGiveToCommunity(ctx) {
    let data: PayToCommunity[] = await getJsonBody(ctx);
    let ret = [];
    await db.transaction(async (trx) => {
      for (let item of data) {
        let tid = await PayCommunity(trx, item.communityId, item.points);
        ret.push(tid);
      }
    });
    return {
      success: true,
      value: ret
    };
  }

  @post('/points/give/user')
  @api
  async pointsGiveToUser(ctx) {
    let data: PayToActivityUser[] = await getJsonBody(ctx);
    let ret = [];
    await db.transaction(async (trx) => {
      for (let item of data) {
        let oid = await PayActivity(trx, item.activityUserId, item.points);
        ret.push(oid);
      }
    });

    return success(ret);
  }
}
