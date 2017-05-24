import { Response, ResponseError } from '../routes';
import { create, getJsonBody } from '../utils';
import { Table } from '../db';
import { Store } from '../models';

export async function getStore(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    if (!communityId) {
      throw new ResponseError('没有社区信息, 请退出后重新进入');
    }

    let store = await Table.Store.where({
      communityId: communityId,
      userId: userId,
    }).first();

    return create(Store, store);
}

export async function getStoreModel(ctx) {
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

  if (!store.businessLicense) {
    throw new ResponseError('请上传营业执照');
  }

  if (!store.legalRepresentativeIdPicture) {
    throw new ResponseError('请上传法人代表身份证');
  }

  return store;
}
