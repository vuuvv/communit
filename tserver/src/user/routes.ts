import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table, db } from '../db';
import { create } from '../utils';

import { addPoints, deductPoints, reverseTransaction } from '../account';

@router('/user')
export class UserController {

  @get('/me')
  @login
  async me(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    if (!communityId) {
      throw new ResponseError('没有社区信息, 请退出后重新从微信进入');
    }
    let user = await db.raw(`
    select wu.headimgurl as avatar, wu.realname as name, wa.accountname as community from t_wechat_user as wu
    join weixin_account as wa on wu.officialAccountId=wa.id
    where wu.officialAccountId=? and wu.userId=?
    `, [communityId, userId]);

    return success(user[0][0]);
  }

  @get('/test')
  async hello() {
    return 'hello';
  }

  @get('/add/account')
  async addAccount(ctx) {
    let user = await Table.WechatUser.first();
    await db.transaction(async (trx) => {
      await addPoints(
        trx, user.officialAccountId, user.userId,
        'c7892688f90948e28008f82dbbd7f648', '68c5a973a00c4f33a10b9ae9d60879fa', 100);
    });
    return success();
  }

  @get('/deduct/account')
  async deductAccount() {
    let user = await Table.WechatUser.first();
    await db.transaction(async (trx) => {
      await deductPoints(trx, user.officialAccountId, user.userId, '68c5a973a00c4f33a10b9ae9d60879fa', 13160);
    });
    return success();
  }

  @get('/reverse/:id')
  async reverse(ctx) {
    await db.transaction(async (trx) => {
      await reverseTransaction(trx, ctx.params.id);
    });
    return success();
  }
}
