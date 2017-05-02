import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, db, raw, first } from '../db';
import { create } from '../utils';
import { getStore } from '../store';
import { getProductModel, savePhotos } from './product';
import { Wechat } from '../wechat';
import { Product } from '../models';

@router('/product')
export class ProductController {

  @get('/category')
  @wechat
  async category(ctx) {
    let ret = await raw(`
    select
      id, name, icon as image
    from t_product_category as m1
    where m1.parentId = '' or m1.parentId is null
    order by m1.sort
    `, []);
    return success(ret);
  }

  @get('/category/:id/children')
  @wechat
  async categoryChildren(ctx) {
    let curr = await first('select id, parentId from t_product_category where id = ?', [ctx.params.id]);
    if (!curr) {
      throw new Error('无效的商品分类');
    }
    let id = curr.parentId || curr.id;

    let all = [];
    await db.transaction(async (trx) => {
      await raw('SET SESSION group_concat_max_len = 1000000', [], trx);
      all = await raw(`
      select
        id, name, (
          select
            concat(
              '[',
              group_concat(json_object('id', m2.id, 'name', m2.name)),
              ']'
            )
          from t_product_category as m2 where m2.parentId=m1.id
          order by m2.sort
        ) as children
      from t_product_category as m1
      where m1.parentId = '' or m1.parentId is null
      order by m1.sort
      `, [], trx);
    });



    let current = all.find((v) => v.id === id);

    return success({
      all,
      current,
    });
  }

  @get('/')
  @wechat
  async list(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;

    let categoryId = ctx.query.categoryId;
    let categories = [];
    if (categoryId) {
      categories = await raw('select id from t_product_category where parentId = ?', [categoryId]);
      categories = categories.map((v) => v.id);
      categories.push(categoryId);
    }

    let sql = `
      select p.*, c.icon as categoryIcon, c.name as categoryName, c.id as categoryId, s.name as storeName from t_product as p
      join t_product_category as c on p.categoryId = c.id
      join t_store as s on p.storeId = s.id
      where
        s.communityId = :communityId and
        s.status = 'normal' and
        p.status = 'online' and
        <% if (query.categoryId) { %> p.categoryId in (:categories)  <% } else { %> 1 = 1 <% } %> and
        <% if (query.keyword) { %> p.title like :keyword  <% } else { %> 1 = 1 <% } %>
      <% if(query.sort === 'points') { %>
      order by p.points asc
      <% } else { %>
      order by p.updatedAt desc
      <% } %>
    `;

    sql = ejs.render(sql, ctx);

    let ret = await raw(sql, Object.assign({communityId: communityId, categories}, ctx.query, {keyword: `%${ctx.query.keyword}%`}));

    return success(ret);
  }

  @get('/item/:id')
  @wechat
  async item(ctx) {
    let id = ctx.params.id;
    let ret = await first(`
      select p.*, s.address as storeAddress, s.name as storeName from t_product as p
      join t_store as s on p.storeId = s.id
      where p.id = ?
      `, [ id ]);

    if (ctx.query.isMine) {
      let communityId = ctx.session.communityId;
      let userId = ctx.session.userId;
      if (!userId) {
        throw new Error('请先注册');
      }
      let store = await Table.Store.where({
        communityId: communityId,
        userId: userId,
      }).first();
      if (store.id !== ret.storeId) {
        throw new Error('不可查看其他店铺的商品');
      }
    }

    return success(ret);
  }

  @post('/add')
  @login
  async add(ctx) {
    let store = await getStore(ctx);
    if (_.isNil(store) || store.status !== 'normal') {
      throw new ResponseError('您现在还没有店铺, 或者您的店铺还没通过审核');
    }

    let model = await getProductModel(ctx);
    let product = create(Product, model);

    let wechat = await Wechat.create(ctx.session.communityId);
    let images = await savePhotos(model.serverIds, wechat);
    product.images = JSON.stringify(images);

    product.storeId = store.id;

    await Table.Product.insert(product);

    return success();
  }

  @post('/edit')
  @login
  async edit(ctx) {
    let store = await getStore(ctx);
    if (_.isNil(store) || store.status !== 'normal') {
      throw new ResponseError('您现在还没有店铺, 或者您的店铺还没通过审核');
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

  @post('/offline/:id')
  @login
  async offline(ctx) {
    let store = await getStore(ctx);
    if (_.isNil(store) || store.status !== 'normal') {
      throw new ResponseError('您现在还没有店铺, 或者您的店铺还没通过审核');
    }

    let product = await Table.Product.where('id', ctx.params.id).first();

    if (!product) {
      throw new ResponseError('该产品不存在');
    }

    if (product.storeId !== store.id) {
      throw new ResponseError('不可编辑其他店铺的商品');
    }
    await Table.Product.where('id', ctx.params.id).update({
      status: 'offline',
    });
    return success();
  }

  @post('/online/:id')
  @login
  async online(ctx) {
    let store = await getStore(ctx);
    if (_.isNil(store) || store.status !== 'normal') {
      throw new ResponseError('您现在还没有店铺, 或者您的店铺还没通过审核');
    }

    let product = await Table.Product.where('id', ctx.params.id).first();

    if (!product) {
      throw new ResponseError('该产品不存在');
    }

    if (product.storeId !== store.id) {
      throw new ResponseError('不可编辑其他店铺的商品');
    }
    await Table.Product.where('id', ctx.params.id).update({
      status: 'online',
    });
    return success();
  }
}
