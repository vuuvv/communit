import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, db, raw, first } from '../db';
import { uuid, create, getJsonBody } from '../utils';
import { getStore } from '../store';
import { Product, SociallyActivity, SociallyActivityUser } from '../models';

@router('/activity')
export class ActivityController {
  @post('/add')
  @login
  async type(ctx) {
    let data = await getJsonBody(ctx);
    let activity = new SociallyActivity();
    activity.createdat = activity.updatedat = new Date();
    activity.creator = activity.updator = ctx.session.userId;
    for (let key of Object.keys(data)) {
      activity[key] = data[key];
    }
    activity.status = 1;
    activity.accountid = ctx.session.communityId;
    let ids = await Table.SociallyActivity.insert(activity).select('id');

    let user = new SociallyActivityUser();
    user.activityId = ids[0];
    user.communityId = ctx.session.communityId;
    user.userId = ctx.session.userId;
    user.post = 'leader';

    await Table.SociallyActivityUser.insert(user);
    return success();
  }

  @post('/start/:id')
  @login
  async start(ctx) {
    let activity = await Table.SociallyActivity.where('id', ctx.params.id).first();
    if (!activity) {
      throw new Error('无此活动');
    }
    if (activity.status !== 1) {
      throw new Error('该活动不可进行该操作');
    }
    await Table.SociallyActivity.where('id', ctx.params.id).update({
      status: 2,
    });
    return success();
  }

  @post('/join/:id')
  @login
  async join(ctx) {
    let activity = await Table.SociallyActivity.where('id', ctx.params.id).first();
    if (!activity) {
      throw new Error('无此活动');
    }
    if (activity.status !== 1) {
      throw new Error('该活动不可进行该操作');
    }

    let user = await Table.SociallyActivityUser.where({
      communityId: ctx.session.communityId,
      userId: ctx.session.userId,
    }).first();

    if (user) {
      throw new Error('用户已报名该活动，不可重复报名');
    }

    let suser = new SociallyActivityUser();
    suser.activityId = activity.id;
    suser.communityId = ctx.session.communityId;
    suser.userId = ctx.session.userId;

    await Table.SociallyActivityUser.insert(suser);

    return success();
  }

  @get('/item/:id')
  @wechat
  async item(ctx) {
    let activity = await first(`
    select sa.*, o.organizationname from t_socially_activity as sa
    join t_organization as o on sa.organizationId = o.id
    where sa.id = ?
    `, [ctx.params.id]);

    let users = await raw(`
    select wu.*, au.post, au.status from t_socially_activity_user as au
    join t_wechat_user as wu on au.communityId=wu.officialAccountId and au.userId=wu.userId
    where au.activityId = ?
    `, [ctx.params.id]);

    let me = _.find(users, (u: any) => u.officialAccountId === ctx.session.communityId && u.userId === ctx.session.userId);

    return success({
      activity,
      users,
      me,
    });
  }

  @get('/search')
  @wechat
  async search(ctx) {
    let ret = await raw(`
    select sa.*, o.organizationname from t_socially_activity as sa
    join t_organization as o on sa.organizationId = o.id
    order by updatedat
    `, []);
    return success(ret);
  }
}
