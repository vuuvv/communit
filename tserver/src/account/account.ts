import * as _ from 'lodash';
import { Table, db, raw, first } from '../db';
import { uuid } from '../utils';

import {
   Account, AccountDetail, Transaction, TransactionDetail, Order,
   OrderDetail, OrderType, OrderStatus, SociallyActivityUserStatus,
   SociallyActivityUser,
} from '../models';

async function getWechatUser(officialAccountId, userId) {
  return await Table.WechatUser.where({officialAccountId, userId}).first();
}


export class AccountType {
  static Normal = 'c7892688f90948e28008f82dbbd7f648';
  static Buy = 'ae9215d040204b05b6ac345462c13b33';
  static Store = '8771f55f8b854dfaa951e75329894d49';
}

export class TransactionType {
  static PayProduct = '04b80557548d4d6588bff877afe03c6d';
  static GetProduct = 'd94d01e8d6b4411f842bf4dc295c969d';
  static PayService = '88c09b4eefe345d59cba1cb55fcafe74';
  static GetService = '469e867fb97a4f998726880ada7608c8';
  static PayHelper = 'd797447ed34046b7aa93cf3e691a2395';
  static GetHelper = '6159a3ccdf3c4520bba65b3be8596407';
  static PayAnswer = '13592beb5cfb4909a3deb55b4fa0504c';
  static GetAnswer = '622e613d206d4e5297e2d330a9e706dc';
  static PayCommunity = '6f822ac9c88a4e13bf4eaacf1050dcac';
  static PayActivity = '20869530294748e2971f46b19d5da328';
  static GetActivity = '68c5a973a00c4f33a10b9ae9d60879fa';
  static RefundPayActivity = '4d6c9ff43fe1420dbca306a8287b175c';
  static RefundGetActivity = 'cda6e63b1bc0462cb22d859d47869c40';
}

const reverseTransactionTypes = {};
reverseTransactionTypes[TransactionType.PayActivity] = TransactionType.RefundPayActivity;
reverseTransactionTypes[TransactionType.GetActivity] = TransactionType.RefundGetActivity;

async function insertTransactionDetail(trx: any, accountDetail: AccountDetail, points: number, transactionId: string) {
  let td = new TransactionDetail();
  td.communityId = accountDetail.communityId;
  td.userId = accountDetail.userId;
  td.transactionId = transactionId;
  td.accountDetailId = accountDetail.id;
  td.amount = points;
  td.remain = accountDetail.remain;
  await Table.TransactionDetail.transacting(trx).insert(td);
  return td;
}

async function insertTransaction(trx: any, account: Account, transactionTypeId: string, points: number, id = null, orderId = null) {
    let accounts: Account[] = await Table.Account.transacting(trx).where({
      communityId: account.communityId,
      userId: account.userId,
    }).select('balance');

    let details: AccountDetail[] = await raw(`
    select at.id, at.name, ad.remain from t_account_detail as ad join t_account_type as at on ad.typeId = at.id
    where ad.communityId = ? and ad.userId = ? and ad.remain > 0
    `, [account.communityId, account.userId], trx);

    let t = new Transaction();
    t.communityId = account.communityId;
    t.userId = account.userId;
    t.typeId = transactionTypeId;
    t.amount = points;
    t.remain = _.sumBy(accounts, v => v.balance);
    t.remainDetail = JSON.stringify(details);
    if (id) {
      t.id = id;
    }
    t.orderId = orderId;
    await Table.Transaction.transacting(trx).insert(t);
    return t;
}

async function reverseTransactionDetail(trx: any, detail: TransactionDetail, tid: string) {
  let accountDetail: AccountDetail = await Table.AccountDetail.transacting(trx).where('id', detail.accountDetailId).first();

  accountDetail.remain -= detail.amount;

  await Table.AccountDetail.transacting(trx).where('id', accountDetail.id).update({
    remain: accountDetail.remain
  });

  await insertTransactionDetail(trx, accountDetail, -detail.amount, tid);
  return [accountDetail.typeId, -detail.amount];
}

export async function reverseTransaction(trx: any, transactionId: string) {
  let t: Transaction = await Table.Transaction.transacting(trx).where('id', transactionId).forUpdate().first();
  if (!t) {
    throw new Error(`无效的交易号: ${transactionId}`);
  }

  if (t.reverseTransactionId) {
    throw new Error(`该交易已退， 不可再退`);
  }

  let accounts: Account[] = await Table.Account.transacting(trx).where({
    communityId: t.communityId,
    userId: t.userId,
  }).forUpdate();

  let tid = uuid();

  let dirtyAccounts: Account[] = [];

  let details: TransactionDetail[] = await Table.TransactionDetail.transacting(trx).where('transactionId', transactionId);
  for (let detail of details) {
    let ret: any[] = await reverseTransactionDetail(trx, detail, tid);
    let account = _.find(accounts, a => a.typeId === ret[0]);
    dirtyAccounts.push(account);
    account.balance += ret[1];
  }

  for (let account of dirtyAccounts) {
    await Table.Account.transacting(trx).where('id', account.id).update({
      balance: account.balance
    });
  }

  let type = reverseTransactionTypes[t.typeId] || t.typeId;

  await insertTransaction(trx, accounts[0], type, -t.amount, tid, t.orderId);
  await Table.Transaction.transacting(trx).where('id', t.id).update({
    reverseTransactionId: tid
  });

  return tid;
}

/**
 * 增加积分
 * @param trx 事务对象
 * @param communityId 社区Id
 * @param userId 用户Id
 * @param accountTypeId 用户账户类型的Id
 * @param transactionTypeId 交易类型的Id
 * @param points 增加的积分数
 * @param expiresIn 有效期限(天)
 */
export async function addPoints(trx, communityId, userId, accountTypeId, transactionTypeId, points, expiresIn = 180, orderId = null) {
  let account: Account = await Table.Account.transacting(trx).where({
    communityId: communityId,
    userId: userId,
    typeId: accountTypeId,
  }).forUpdate().first();

  let accountDetail = new AccountDetail();
  accountDetail.communityId = communityId;
  accountDetail.userId = userId;
  accountDetail.typeId = accountTypeId;
  accountDetail.total = points;
  accountDetail.remain = points;
  accountDetail.expiresIn = new Date(new Date().getTime() + expiresIn * 24 * 3600 * 1000);

  await Table.AccountDetail.transacting(trx).insert(accountDetail);
  if (!account) {
    account = new Account();
    account.communityId = communityId;
    account.userId = userId;
    account.typeId = accountTypeId;
    account.balance = points;
    await Table.Account.transacting(trx).insert(account);
  } else {
    account.balance += points;
    await Table.Account.transacting(trx).where({
      id: account.id
    }).update({
      balance: account.balance
    });
  }

  let t = await insertTransaction(trx, account, transactionTypeId, points, orderId);

  await insertTransactionDetail(trx, accountDetail, points, t.id);

  return t.id;
}

export async function deductPoints(trx, communityId, userId, transactionTypeId, points, orderId = null) {
  let accounts: Account[] = await Table.Account.transacting(trx).where({
    communityId: communityId,
    userId: userId,
  }).forUpdate();

  if (!accounts || !accounts.length) {
    throw new Error('余额不足');
  }

  let details: AccountDetail[] = await Table.AccountDetail.transacting(trx)
    .where('communityId', communityId)
    .where('userId', userId)
    .where('remain', '>', 0)
    .orderBy('expiresIn');

  if (!details || !details.length || _.sumBy(details, v => v.remain) < points) {
    throw new Error('余额不足');
  }

  let tid = uuid();

  let detailMap = {
  };

  accounts.forEach((v) => {
    detailMap[v.typeId] = [v, 0];
  });

  // 更新子账户，和交易详情
  let remained = points;
  for (let detail of details) {
    if (remained === 0) {
      break;
    }

    let map = detailMap[detail.typeId];
    let currentDeduct = 0;
    if (detail.remain >= remained) {
      // 该子账户的余额足够扣
      currentDeduct = remained;
      detail.remain -= remained;
      remained = 0;
    } else {
      currentDeduct = detail.remain;
      remained -= detail.remain;
      detail.remain = 0;
    }
    await Table.AccountDetail.transacting(trx).where('id', detail.id).update('remain', detail.remain);
    await insertTransactionDetail(trx, detail, -currentDeduct, tid);
    map[1] -= currentDeduct;

  }

  // 更新账户
  for (let key of Object.keys(detailMap)) {
    let v = detailMap[key];
    if (v[1] === 0) {
      // 账户无需更新
      return;
    }
    let account = v[0];
    await Table.Account.transacting(trx).where('id', account.id).update('balance', account.balance + v[1]);
  }

  await insertTransaction(trx, accounts[0], transactionTypeId, -points, tid, orderId);
  return tid;
}

export async function refundOrder(trx, orderId) {
  if (!orderId) {
    throw new Error('orderId为空');
  }

  let order: Order = await Table.Order.transacting(trx).where('id', orderId).forUpdate().first();
  if (!order) {
    throw new Error(`无效的订单:${orderId}`);
  }

  if (order.status === OrderStatus.Refund) {
    throw new Error('订单已退款，不可重复退款');
  }

  // if (order.buyerTradeTransactionId) {
  //   order.buyerRefundTransactionId = await reverseTransaction(trx, order.buyerTradeTransactionId);
  // }
  // if (order.sellerRefundTransactionId) {
  //   order.sellerRefundTransactionId = await reverseTransaction(trx, order.sellerTradeTransactionId);
  // }

  let transactions = await Table.Transaction.transacting(trx).where('orderId', orderId);
  for (let t of transactions){
    if (!t.reverseTransaction) {
      await reverseTransaction(trx, t.id);
    }
  }

  await Table.Order.transacting(trx).where('id', orderId).update({
    status: OrderStatus.Refund,
    buyerRefundTransactionId: order.buyerRefundTransactionId,
    sellerRefundTransactionId: order.sellerRefundTransactionId,
  });
}

export async function PayCommunity(trx, communityId, points) {
  if (!communityId) {
    throw new Error('communityId不能为空');
  }
  points = parseInt(points, 10);
  if (isNaN(points) || points < 0) {
    throw new Error('points需为整数，且不能为负数');
  }

  let tid = await addPoints(trx, communityId, communityId, AccountType.Normal, TransactionType.PayCommunity, points);
  return tid;
}

export async function PayActivity(trx, activityUserId, points) {
    points = parseInt(points, 10);
    if (!activityUserId) {
      throw new Error('activityUserId不能为空');
    }
    points = parseInt(points, 10);
    if (isNaN(points) || points < 0) {
      throw new Error('points需为整数，且不能为负数');
    }

    let activityUser = await Table.SociallyActivityUser.transacting(trx).where('id', activityUserId).forUpdate().first();
    if (!activityUser) {
      throw new Error('无效的activityUserId');
    }

    let communityId = activityUser.communityId;

    let seller = await getWechatUser(communityId, activityUser.userId);

    if (activityUser.status === SociallyActivityUserStatus.Payed) {
      throw new Error(`用户[${seller.realname}]已从活动中获取到积分， 不可重复获取, orderid: ${activityUser.orderId}`);
    }

    let activity = await Table.SociallyActivity.where('id', activityUser.activityId).first();

    if (!activity) {
      throw new Error(`activityUserId关联的activity已失效, activityUserId: ${activityUserId}, acitivtyId: ${activityUser.activityId}`);
    }


    let order = new Order();
    order.type = OrderType.Activity;
    order.communityId = activityUser.communityId;
    order.sellerId = seller.userId;
    order.buyerId = communityId;
    order.orderTime = order.payTime = order.tradeTime = new Date();

    let detail = new OrderDetail();
    detail.orderId = order.id;
    detail.type = OrderType.Activity;
    detail.productId = activityUserId;

    let amount = order.amount = points;

    order.buyerTradeTransactionId = await deductPoints(
      trx, communityId, order.buyerId, TransactionType.PayActivity, amount, order.id
    );

    order.sellerTradeTransactionId = await addPoints(
      trx, communityId, order.sellerId , AccountType.Normal, TransactionType.GetActivity, amount, undefined, order.id
    );

    order.status = OrderStatus.Done;

    await Table.Order.transacting(trx).insert(order);

    detail.points = amount;
    detail.data = JSON.stringify({
      activity: activity,
      activityUser: activityUser,
    });

    await Table.OrderDetail.transacting(trx).insert(detail);

    await Table.SociallyActivityUser.transacting(trx).where('id', activityUser.id).update({
      orderId: order.id,
      points: points,
      status: SociallyActivityUserStatus.Payed,
    });

    return order.id;
}

export async function RefundActivityUser(trx, activityUserId: string) {
    if (!activityUserId) {
      throw new Error('activityUserId不能为空');
    }

    let activityUser: SociallyActivityUser =
      await Table.SociallyActivityUser.transacting(trx).where('id', activityUserId).forUpdate().first();

    if (!activityUser) {
      throw new Error('无效的activityUserId');
    }

    if (activityUser.status !== SociallyActivityUserStatus.Payed) {
      throw new Error('活动积分还未发放，无法退款');
    }

    await refundOrder(trx, activityUser.orderId);

    await Table.SociallyActivityUser.transacting(trx).where('id', activityUserId).update({
      orderId: null,
      points: 0,
      status: SociallyActivityUserStatus.Refund,
    });

    return activityUser.orderId;
}

export async function ChangeActivityUser(trx, activityUserId: string, points) {
    points = parseInt(points, 10);
    if (isNaN(points) || points < 0) {
      throw new Error('points需为整数，且不能为负数');
    }

    if (!activityUserId) {
      throw new Error('activityUserId不能为空');
    }

    let activityUser: SociallyActivityUser =
      await Table.SociallyActivityUser.transacting(trx).where('id', activityUserId).forUpdate().first();

    if (!activityUser) {
      throw new Error('无效的activityUserId');
    }

    if (activityUser.status === SociallyActivityUserStatus.Payed) {
      if (activityUser.points === points) {
        // 已发放而且数值相同，不需要操作
        return activityUser.orderId;
      }
      // 已发放但数值不同，要先退款，再发放
      await refundOrder(trx, activityUser.orderId);
      await Table.SociallyActivityUser.transacting(trx).where('id', activityUserId).update({
        orderId: null,
        points: 0,
        status: SociallyActivityUserStatus.Refund,
      });
    }

    return await PayActivity(trx, activityUserId, points);
}
