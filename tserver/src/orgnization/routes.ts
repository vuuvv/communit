import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, db, raw, first } from '../db';
import { uuid, create, getJsonBody } from '../utils';
import { getStore } from '../store';
import { Product } from '../models';

@router('/organization')
export class OrganizationController {
  @get('/children/:id')
  @wechat
  async type(ctx) {
    let organization = await Table.Organization.where('id', ctx.params.id).first();
    let children = await Table.Organization.where({
      parentId: ctx.params.id,
    }).orderBy('seq');
    return success({
      organization,
      children
    });
  }

  @get('/home')
  @wechat
  async home(ctx) {
    let ret = await raw(`
    select
      id, organizationname, (
        select
          concat(
            '[',
            group_concat(json_object('id', id, 'organizationname', organizationname)),
            ']'
          )
        from t_organization as o2 where o2.parentId=o1.id
        order by o2.seq
      ) as children
    from t_organization as o1
    where o1.accountid = ? and (o1.parentId = '' or o1.parentId is null)
    order by o1.seq
    `, [ctx.session.communityId]);
    return success(ret);
  }

  @get('/item/:id')
  @wechat
  async item(ctx) {
    let ret = await Table.Organization.where('id', ctx.params.id).first();
    return success(ret);
  }

  @get('/:id/users')
  @wechat
  async users(ctx) {
    let ret = await Table.OrganizationUser.where({
      organizationid: ctx.params.id,
    }).orderBy('realname');
    return success(ret);
  }

  @get('/joined/:id')
  @login
  async joined(ctx) {
    let user = await Table.WechatUser.where({
      officialAccountId: ctx.session.communityId,
      userId: ctx.session.userId,
    }).first();

    let ouser = await Table.OrganizationUser.where({
      organizationid: ctx.params.id,
      subuserid: user.id,
    }).first();

    return success(ouser);
  }

  @post('/join/:id')
  @login
  async join(ctx) {
    let user = await Table.WechatUser.where({
      officialAccountId: ctx.session.communityId,
      userId: ctx.session.userId,
    }).first();

    let data = await getJsonBody(ctx);
    data.id = uuid();
    data.username = data.realname = data.name;
    data.organizationid = ctx.params.id;
    data.subuserid = user.id;
    data.status = 'submit';
    data.roleId = 1;
    delete data.name;
    await Table.OrganizationUser.insert(data);
    return success();
  }
}
