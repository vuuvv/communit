import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table, db, raw, first } from '../db';
import { create } from '../utils';
import { getStore } from '../store';
import { getProductModel } from './product';
import { Product } from '../models';

@router('/product')
export class ProductController {

  @get('/category')
  @login
  async category(ctx) {
    let ret = await Table.ProductCategory.orderBy('sort');

    return success(ret);
  }

  @get('/')
  @login
  async list(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;

    let sql = `
      select p.*, c.icon as categoryIcon, c.name as categoryName, c.id as categoryId from t_product as p
      join t_product_category as c on p.categoryId = c.id
      join t_store as s on p.storeId = s.id
      where
        s.communityId = :communityId and
        <% if (query.categoryId) { %> p.categoryId = :categoryId <% } else { %> 1 = 1 <% } %> and
        <% if (query.keyword) { %> p.title like :keyword  <% } else { %> 1 = 1 <% } %>
      order by p.updatedAt desc
    `;

    sql = ejs.render(sql, ctx);

    let ret = await raw(sql, Object.assign({communityId: communityId}, ctx.query, {keyword: `%${ctx.query.keyword}%`}));

    return success(ret);
  }

  @get('/item/:id')
  @login
  async item(ctx) {
    let id = ctx.params.id;
    let ret = await first(`
      select p.*, s.address as storeAddress, s.name as storeName from t_product as p
      join t_store as s on p.storeId = s.id
      where p.id = ?
      `, [ id ]);

    return success(ret);
  }

  @post('/add')
  @login
  async add(ctx) {
    let store = await getStore(ctx);
    if (_.isNil(store)) {
      throw new ResponseError('您现在还没有店铺');
    }

    let model = await getProductModel(ctx);
    let product = create(Product, model);
    product.storeId = store.id;

    await Table.Product.insert(product);

    return success();
  }

  @post('/edit')
  @login
  async edit(ctx) {
    let store = await getStore(ctx);
    if (_.isNil(store)) {
      throw new ResponseError('您现在还没有店铺');
    }

    let model = await getProductModel(ctx);

    let product = await Table.Product.where('id', model.id).first();

    if (!product) {
      throw new ResponseError('该产品不存在');
    }

    if (product.storeId !== store.id) {
      throw new ResponseError('不可编辑其他店铺的商品');
    }

    await Table.Product.where('id', model.id).update({
      categoryId: model.categoryId,
      title: model.title,
      description: model.description,
      price: model.price,
      points: model.points,
      normalPrice: model.normalPrice,
    });

    return success();
  }
}
