import { router, get, post, all, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, db, first, raw } from '../db';
import { create, successPage } from '../utils';
import { Config } from '../config';

import { addPoints, deductPoints, reverseTransaction } from '../account';

@router('/user')
export class UserController {
  @get('/carousel')
  @wechat
  async carousel(ctx) {
    let communityId = ctx.session.communityId;
    let ret = await Table.Carousel.where('ACCOUNTID', communityId).select('IMAGE_HREF as image');
    return success(ret);
  }

  @get('/logo')
  @wechat
  async logo(ctx) {
    let account = await Table.WechatOfficialAccount.where('id', ctx.session.communityId).first().select('logo');
    return success(account);
  }

  @get('/me')
  @wechat
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

    let balance = await first(`
    select sum(a.balance) as balance from t_account as a
    where a.communityId = ? and a.userId = ?
    `, [communityId, userId]);

    let points = await first(`
    select sum(total) as points from t_account_detail
    where communityId = ? and userId = ?
    `, [communityId, userId]);

    let store = await Table.Store.where({communityId, userId}).first();

    user.balance = balance ? (balance.balance || 0) : 0;
    user.points = points ? (points.points || 0) : 0;

    return success({
      user,
      store,
    });
  }

  @get('/organizations')
  @wechat
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

  @get('/biotope')
  @wechat
  async biotype(ctx) {
    let communityId = ctx.session.communityId;
    let ret = await raw(`
      select * from t_biotope where communityId = ? order by sort
    `, [communityId]);

    return success(ret);
  }

  @get('/workers')
  @login
  async workers(ctx) {
    let workers = await raw(`
    select ou.*, o.organizationname from t_organuser as ou
    join t_wechat_user as wu on ou.subuserid = wu.id
    join t_organization as o on o.id = ou.organizationid
    where wu.officialAccountId = ? and wu.userId = ?
    `, [ctx.session.communityId, ctx.session.userId]);

    return success(workers);
  }

  @get('/test')
  async hello() {
    return 'hello';
  }

  @get('/add/account')
  async addAccount(ctx) {
    let user = await Table.WechatUser.where({
      userId: ctx.session.userId,
      officialAccountId: ctx.session.communityId,
    }).first();
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

  @get('/logout')
  async logout(ctx) {
    delete ctx.session.userId;
    const config = await Config.instance();
    ctx.redirect(config.site.client);
  }

  @get('/points/:type')
  async points(ctx) {
    let type = ctx.params.type;
    if (type === 'activity') {
    } else {
    }
  }
}
