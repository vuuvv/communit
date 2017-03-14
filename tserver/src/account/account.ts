import * as _ from 'lodash';
import { Table, db, raw, first } from '../db';
import { uuid } from '../utils';

import { Account, AccountDetail, Transaction, TransactionDetail } from '../models';

export class AccountType {
  static Normal = 'c7892688f90948e28008f82dbbd7f648';
  static Buy = 'ae9215d040204b05b6ac345462c13b33';
}

export class TransactionType {
  static PayProduct = '04b80557548d4d6588bff877afe03c6d';
  static GetProduct = 'd94d01e8d6b4411f842bf4dc295c969d';
}

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

async function insertTransaction(trx: any, account: Account, transactionTypeId: string, points: number, id = null) {
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

  await insertTransaction(trx, accounts[0], t.typeId, -t.amount, tid);
  await Table.Transaction.transacting(trx).where('id', t.id).update({
    reverseTransactionId: tid
  });
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
export async function addPoints(trx, communityId, userId, accountTypeId, transactionTypeId, points, expiresIn = 180) {
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

  let t = await insertTransaction(trx, account, transactionTypeId, points);

  await insertTransactionDetail(trx, accountDetail, points, t.id);

  return t.id;
}

export async function deductPoints(trx, communityId, userId, transactionTypeId, points) {
  let accounts: Account[] = await Table.Account.transacting(trx).where({
    communityId: communityId,
    userId: userId,
  }).forUpdate();

  console.log(communityId, userId);

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

  await insertTransaction(trx, accounts[0], transactionTypeId, -points, tid);
  return tid;
}
