import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table, db } from '../db';
import { create } from '../utils';

@router('/user')
export class UserController {

  @get('/me')
  @login
  async me(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    if (!communityId) {
      throw new ResponseError('没有社区信息, 请退出后重新从微信进入');
    }
    let user = await db.raw(`
    select wu.headimgurl as avatar, wu.realname as name, wa.accountname as community from t_wechat_user as wu
    join weixin_account as wa on wu.officialAccountId=wa.id
    where wu.officialAccountId=? and wu.userId=?
    `, [communityId, userId]);

    return success(user[0][0]);
  }

  @get('/test')
  async hello() {
    return 'hello';
  }
}
