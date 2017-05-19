import { router, get, post, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody } from '../utils';
import { Account } from '../models';
import { AccountType, TransactionType, getUserBalance } from '../account';

function sum(array, fn) {
  let ret = 0;
  array.forEach((item) => {
    let n = fn(item) || 0;
    ret += n;
  });
  return ret;
}

function sumif(array, fn) {
  let ret = 0;
  array.forEach((item) => {
    if (fn(item)) {
      ret += item.amount || 0;
    }
  });
  return ret;
}

@router('/account')
export class AccountController {
  @get('/balance')
  @wechat
  async balance(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    if (!userId) {
      return success(0);
    }
    let balance = await getUserBalance(communityId, userId);
    return success(balance);
  }

  @get('/summary')
  @login
  async summary(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;

    let balance = await raw(`
    select at.id, at.name, sum(if(a.balance is null, 0, a.balance)) as amount from t_account_type as at
    left join t_account as a on at.id = a.typeId and a.communityId = ? and a.userId = ?
		group by at.id
    `, [communityId, userId]);

    let total = await raw(`
    select at.id, at.name, sum(if(a.total is null, 0, a.total)) as amount from t_account_type as at
    left join t_account_detail as a on at.id = a.typeId and a.communityId = ? and a.userId = ?
		group by at.id
    `, [communityId, userId]);

    let detail = await raw(`
    select tt.id, tt.name, sum(if(t.amount is null, 0, t.amount)) as amount, ad.typeId from t_transaction_type as tt
    left join t_transaction as t on tt.id=t.typeId and t.communityId = ? and t.userId = ? and t.createdAt > CONCAT(DATE_FORMAT( CURDATE( ) , '%Y%m' ), '01')
    left join t_transaction_detail as td on t.id = td.transactionId
    left join t_account_detail as ad on td.accountDetailId = ad.id
    group by tt.id, ad.typeId
    `, [communityId, userId]);

    return success({
      activityBalance: sumif(balance, (item) => item.id === AccountType.Normal),
      activityTotal: sumif(total, (item) => item.id === AccountType.Normal),
      activityGet: sumif(detail, (item) => item.typeId === AccountType.Normal && [TransactionType.GetActivity, TransactionType.RefundGetActivity, TransactionType.GetService].indexOf(item.id) !== -1),
      activityPay: -sumif(detail, (item) => item.typeId === AccountType.Normal && [TransactionType.PayActivity, TransactionType.PayProduct, TransactionType.PayService].indexOf(item.id) !== -1),
      buyBalance: sumif(balance, (item) => item.id === AccountType.Buy),
      buyTotal: sumif(total, (item) => item.id === AccountType.Buy),
      buyGet: sumif(detail, (item) => item.typeId === AccountType.Buy && [TransactionType.GetActivity, TransactionType.RefundGetActivity, TransactionType.GetService].indexOf(item.id) !== -1),
      buyPay: -sumif(detail, (item) => item.typeId === AccountType.Buy && [TransactionType.PayActivity, TransactionType.PayProduct, TransactionType.PayService].indexOf(item.id) !== -1),
    });
  }

  @post('/add')
  @login
  async add(ctx) {
  }

  @post('/edit')
  @login
  async edit(ctx) {
  }
}
