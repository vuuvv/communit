import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table, db, raw, first } from '../db';
import { uuid, create, getJsonBody } from '../utils';
import { getStore } from '../store';
import { Product } from '../models';

@router('/organization')
export class OrganizationController {
  @get('/type/:id')
  @login
  async type(ctx) {
    let ret = await Table.Organization.where({
      accountid: ctx.session.communityId,
      organtype: ctx.params.id,
    }).orderBy('organizationname');
    return success(ret);
  }

  @get('/item/:id')
  @login
  async item(ctx) {
    let ret = await Table.Organization.where('id', ctx.params.id).first();
    return success(ret);
  }

  @get('/:id/users')
  @login
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
    let data = await getJsonBody(ctx);
    data.id = uuid();
    data.username = data.realname = data.name;
    data.organizationid = ctx.params.id;
    delete data.name;
    await Table.OrganizationUser.insert(data);
    return success();
  }
}
