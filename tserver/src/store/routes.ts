import { router, get, post, success, Response, ResponseError, login } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody } from '../utils';
import { Store } from '../models';
import { getStore, getStoreModel } from './store';

@router('/store')
export class StoreController {
  @get('/')
  @login
  async store(ctx) {
    let ret: any = {};

    ret.store = await getStore(ctx);

    if (ret.store) {
      // ret.products = await Table.Product.where('storeId', ret.store.id).orderBy('updatedAt', 'desc');
      ret.products = await raw(`
      select p.*, c.icon as categoryIcon, c.name as categoryName, c.id as categoryId from t_product as p
      join t_product_category as c on p.categoryId = c.id
      where p.storeId = ?
      order by p.updatedAt desc
      `, [ret.store.id]);

      ret.orders = await raw(`
      select o.*, s.name from t_order as o
      join t_store as s on o.sellerId = s.id
      where s.userId = ? and s.communityId = ?
      order by o.updatedAt desc
      `, [ctx.session.userId, ctx.session.communityId]);

      if (ret.orders.length) {
        let details: any[] = await raw(`
        select * from t_order_detail where orderId in (?)
        `, [ret.orders.map((v) => v.id)]);

        for (let o of ret.orders) {
          o.details = details.filter((d) => o.id === d.orderId);
        }
      }

      ret.accounts = await raw(`
      select a.*, at.name as typeName from t_account as a
      join t_account_type as at on a.typeId=at.id
      where a.userId = ?
      `, [ret.store.id]);
    }

    return success(ret);
  }

  @post('/add')
  @login
  async add(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    if (!communityId) {
      throw new ResponseError('没有社区信息, 请退出后重新从微信进入');
    }

    let user = await Table.WechatUser.where({
      officialAccountId: communityId,
      userId: userId,
    }).first();

    if (!user) {
      throw new ResponseError('用户和社区不匹配，请关闭页面后重新进入');
    }

    let model = await getStoreModel(ctx);

    await db.transaction(async (trx) => {
      let store = await Table.Store.where({
        communityId: communityId,
        userId: userId,
      }).forUpdate().first();

      if (store) {
        throw new ResponseError('您已经在本社区有店铺了, 不允许重复开店');
      }

      let entity = create(Store, model);
      entity.userId = userId;
      entity.communityId = communityId;
      await Table.Store.transacting(trx).insert(entity);
    });

    return success();
  }

  @post('/edit')
  @login
  async edit(ctx) {
    let model = await getStoreModel(ctx);
    let store = await getStore(ctx);
    if (!store) {
      throw new ResponseError('您现在还没有店铺');
    }

    if (store.status !== 'normal') {
      throw new ResponseError('店铺的状态不正常，不能修改店铺信息');
    }

    await Table.Store.where('id', store.id).update({
      id: model.id,
      name: model.name,
      tel: model.tel,
      contact: model.contact,
      description: model.description,
      address: model.address,
    });

    return success();
  }
}
