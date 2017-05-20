import { router, get, post, all, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, db, first, raw } from '../db';
import { create, successPage, getJsonBody } from '../utils';
import { Config } from '../config';

import { addPoints, deductPoints, reverseTransaction } from '../account';
import { ProfileConstants } from './user';

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
  @login
  async me(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    let user = await first(`
    select
      wu.headimgurl as avatar, wu.realname as name, wa.accountname as community, wa.id as communityId, wu.userId
    from t_wechat_user as wu
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

  @get('/profile')
  async profile(ctx) {
    let sql = `
    select
      wu.realname, wu.sex, wu.address, wu.area, wu.address, bu.username as phone, bt.name as biotope,
      su.wenHuaChengDu, su.zhiYeZiGe, su.biYeYuanXiao, su.shenFenZheng, DATE_FORMAT(su.birth, '%Y-%m-%d') as birth, su.political,
      su.jianKuanZK, su.JianKangLB, su.fuWuXingJi, su.geRenTZ from t_wechat_user as wu
    join t_s_user as su on wu.userId=su.id
    join t_s_base_user as bu on su.id=bu.id
    left join t_biotope as bt on wu.biotope=bt.id
    where wu.officialAccountId=? and wu.userId=?
    `;

    let ret = await first(sql, [ctx.session.communityId, ctx.session.userId]);

    return success(ret);
  }

  @post('/profile/update/text')
  @login
  async updateProfileTexxt(ctx) {
    const communityId = ctx.session.communityId;
    const userId = ctx.session.userId;
    const fields = ['realname', 'zhiYeZiGe', 'biYeYuanXiao'];
    const model = await getJsonBody(ctx);
    if (fields.indexOf(model.key) === -1) {
      throw new Error('不可更改');
    }
    if (!model.value) {
      throw new Error('内容不可为空');
    }

    let data = {};
    data[model.key] = model.value;

    if (model.key === 'realname') {
      await Table.WechatUser.where({officialAccountId: communityId, userId}).update(data);
    } else {
      await db('t_s_user').where({id: userId}).update(data);
    }

    return success();

  }

  @post('/profile/update/select')
  @login
  async updateProfile(ctx) {
    const communityId = ctx.session.communityId;
    const userId = ctx.session.userId;
    const model = await getJsonBody(ctx);
    if (!model.key || !model.value) {
      throw new Error(`参数错误, key: ${model.key}, value: ${model.value}`);
    }

    let data = {};
    data[model.key] = model.value;

    if (model.key !== 'birth' && (!ProfileConstants[model.key] || !ProfileConstants[model.key][model.value])) {
      throw new Error(`参数错误, key: ${model.key}, value: ${model.value}`);
    }

    if (model.key === 'sex') {
      await Table.WechatUser.where({officialAccountId: communityId, userId}).update(data);
    } else {
      await db('t_s_user').where({id: userId}).update(data);
    }

    return success();
  }

  @get('/community')
  @wechat
  async community(ctx) {
    return success(ctx.session.communityId);
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

  @get('/id')
  @wechat
  async userId(ctx) {
    return success(ctx.session.userId);
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
