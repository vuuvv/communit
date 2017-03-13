import { router, get, post, success, Response, ResponseError, login } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody } from '../utils';
import { Account } from '../models';

@router('/account')
export class AccountController {
  @get('/balance')
  @login
  async balance(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    let balance = await Table.Account.where({communityId, userId}).sum('balance as balance').first();
    if (!balance || !balance.balance) {
      return success(0);
    }
    return success(balance.balance);
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
