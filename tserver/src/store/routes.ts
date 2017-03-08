import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table, raw, db } from '../db';
import { create, getJsonBody } from '../utils';
import { Store } from '../models';

async function getStore(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    if (!communityId) {
      throw new ResponseError('没有社区信息, 请退出后重新进入');
    }

    return await Table.Store.where({
      communityId: communityId,
      userId: userId,
    }).first();
}

async function getStoreModel(ctx) {
  let store = await getJsonBody(ctx);
  if (!store.name) {
    throw new ResponseError('请填写店铺名称');
  }

  if (!store.tel) {
    throw new ResponseError('请填写联系电话');
  }

  if (!store.contact) {
    throw new ResponseError('请填写联系人');
  }

  if (!store.address) {
    throw new ResponseError('请填写店铺地址');
  }

  if (!store.description) {
    throw new ResponseError('请填写店铺简介');
  }

  return store;
}

@router('/store')
export class StoreController {
  @get('/')
  @login
  async store(ctx) {
    let ret: any = {};

    ret.store = await getStore(ctx);

    if (ret.store) {
      ret.products = await Table.Product.where('storeId', ret.store.id).orderBy('updatedAt', 'desc');
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

    await Table.Store.update({
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
