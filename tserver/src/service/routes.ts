import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table, db, raw, first } from '../db';
import { create, getJsonBody } from '../utils';
import { Service } from '../models';

@router('/service')
export class ServiceController {
  @get('/categories')
  @login
  async categories(ctx) {
    let ret = await Table.ServiceCategory.orderBy('sort');
    return success(ret);
  }

  @get('/category/:id')
  @login
  async category(ctx) {
    let ret = await Table.ServiceCategory.where('id', ctx.params.id).first();
    return success(ret);
  }

  @get('/types/:id')
  @login
  async types(ctx) {
    let ret = await Table.ServiceType.where('categoryId', ctx.params.id).orderBy('sort');
    return success(ret);
  }

  @get('/list')
  @login
  async list(ctx) {
  }

  @get('/search')
  @login
  async search(ctx) {
    let communityId = ctx.session.communityId;

    let sql = `
      select s.*, c.name as categoryName, t.icon as typeIcon, t.name as typeName from t_service as s
      join t_service_category as c on s.categoryId = c.id
      join t_service_type as t on s.typeId = t.id
      where
        s.communityId = :communityId and
        <% if (query.categoryId) { %> s.categoryId = :categoryId <% } else { %> 1 = 1 <% } %> and
        <% if (query.typeId) { %> s.typeId = :typeId  <% } else { %> 1 = 1 <% } %>
      order by s.updatedAt desc
    `;

    sql = ejs.render(sql, ctx);

    let ret = await raw(sql, Object.assign({communityId: communityId}, ctx.query));

    return success(ret);
  }

  @get('/item/:id')
  @login
  async item(ctx) {
    let sql = `
      select s.*, c.name as categoryName, c.fields, t.name as typeName from t_service as s
      join t_service_category as c on s.categoryId = c.id
      join t_service_type as t on s.typeId = t.id
      where
        s.id = ?
      order by s.updatedAt desc
    `;

    let ret = await first(sql, [ctx.params.id]);
    return success(ret);
  }

  @post('/add/:id')
  @login
  async add(ctx) {
    let model = await getJsonBody(ctx);

    let category = await Table.ServiceCategory.where('id', ctx.params.id).first();
    if (!category) {
      throw new ResponseError('非法类型');
    }

    let service = new Service();
    service.categoryId = category.id;
    service.communityId = ctx.session.communityId;
    service.userId = ctx.session.userId;
    service.content = JSON.stringify(model);
    service.typeId = model.type;
    service.points = model.points;


    await Table.Service.insert(service);

    return success();
  }

  @get('/join/:id')
  @login
  async join(ctx) {
    return success();
  }
}
