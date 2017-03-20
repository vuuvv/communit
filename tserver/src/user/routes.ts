import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table, db, first, raw } from '../db';
import { create, successPage } from '../utils';

import { addPoints, deductPoints, reverseTransaction } from '../account';

@router('/user')
export class UserController {
  @get('/carousel')
  @login
  async carousel(ctx) {
    let communityId = ctx.session.communityId;
    let ret = await Table.Carousel.where('ACCOUNTID', communityId).select('IMAGE_HREF as image');
    return success(ret);
  }

  @get('/logo')
  @login
  async logo(ctx) {
    let account = await Table.WechatOfficialAccount.where('id', ctx.session.communityId).first().select('logo');
    return success(account);
  }

  @get('/me')
  @login
  async me(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    if (!communityId) {
      throw new ResponseError('没有社区信息, 请退出后重新从微信进入');
    }
    let user = await first(`
    select wu.headimgurl as avatar, wu.realname as name, wa.accountname as community from t_wechat_user as wu
    join weixin_account as wa on wu.officialAccountId=wa.id
    where wu.officialAccountId=? and wu.userId=?
    `, [communityId, userId]);

    let account = await raw(`
    select a.*, at.name from t_account as a join t_account_type as at on a.typeId = at.id
    where a.communityId = ? and a.userId = ?
    `, [communityId, userId]);

    let store = await Table.Store.where({communityId, userId}).first();

    return success({
      user,
      account,
      store,
    });
  }

  @get('/organizations')
  @login
  async organizations(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    let ret = await raw(`
    select o.* from t_organuser as ou
    join t_wechat_user as wu on ou.subuserid = wu.id
    join t_organization as o on ou.organizationid = o.id
    where wu.officialAccountId = ? and wu.userId = ?
    `, [communityId, userId]);

    if (!ret || !ret.length) {
      throw new Error('您并非社工人员');
    }

    return success(ret);
  }

  @get('/test')
  async hello() {
    return 'hello';
  }

  @get('/add/account')
  async addAccount(ctx) {
    let user = await Table.WechatUser.orderBy('createdAt').first();
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
