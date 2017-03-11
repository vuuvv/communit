import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table, db, raw, first } from '../db';
import { create, getRawBody } from '../utils';
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
  }

  @post('/add/:id')
  @login
  async add(ctx) {
    let model = await getRawBody(ctx);

    let category = await Table.ServiceCategory.where('id', ctx.params.id);
    if (!category) {
      throw new ResponseError('非法类型');
    }

    let service = new Service();
    service.categoryId = category.id;
    service.communityId = ctx.session.communityId;
    service.userId = ctx.session.userId;
    service.content = model;

    await Table.Service.insert(service);

    return success();
  }

  @get('/join/:id')
  @login
  async join(ctx) {
    return success();
  }
}
