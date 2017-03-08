import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table, raw } from '../db';
import { create, getJsonBody } from '../utils';

@router('/store')
export class StoreController {
  @get('/')
  @login
  async store(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    if (!communityId) {
      throw new ResponseError('没有社区信息, 请退出后重新从微信进入');
    }
    let store = await raw(`
    select * from t_store
    where communityId=? and userId=?
    `, [communityId, userId]);

    return success(store);
  }

  @post('/add')
  @login
  async add(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    if (!communityId) {
      throw new ResponseError('没有社区信息, 请退出后重新从微信进入');
    }
    let store = await raw(`
    select * from t_store
    where communityId=? and userId=?
    `, [communityId, userId]);
    if (!store.name) {
    }
  }
}
