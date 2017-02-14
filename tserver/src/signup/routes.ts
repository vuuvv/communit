import { router, get, post, all, success, error, Response, ResponseError } from '../routes';
import { getRawBody } from '../utils';
import { db, Table } from '../db';

@router('/signup')
export class SignupController　{
  /**
   * 用户填写注册信息, 生成用户
   */
  @post('/')
  async signup(ctx) {
    const tel = ctx.session.verifiedPhone;
    const wechatUserId = ctx.session.wechatUserId;
    if (!tel) {
      throw new ResponseError('请先验证手机');
    }
    let body = await getRawBody(ctx);
    const model = JSON.parse(body.toString());
    if (!model.name) {
      throw new ResponseError('请填写您的姓名');
    }
    if (!model.area) {
      throw new ResponseError('请填写您所在的小区');
    }
    if (!model.address) {
      throw new ResponseError('请填写您的地址');
    }
    model.phone = tel;

    await db.transaction(async (trx) => {
      let user = await Table.User.transacting(trx).where('phone', tel).forUpdate().first();
      if (user) {
        throw new ResponseError('用户已存在');
      }
      let ids = await Table.User.transacting(trx).insert(model).select('id');
      if (wechatUserId) {
        let wUser = await Table.WechatUser.where('id', wechatUserId).first();
        if (wUser) {
          await Table.User.transacting(trx).where('id', ids[0]).update({
            avatar: wUser.headimgurl,
            sex: wUser.sex,
          });
          await Table.WechatUser.transacting(trx).where('id', wechatUserId).update({
            userId: ids[0],
          });
        }
      }
    });
    delete ctx.session.verifiedPhone;
    delete ctx.session.wechatUserid;
    return success();
  }

  /**
   * 手机号验证
   */
  @post('/verify')
  async createVerify(ctx) {
    let body = await getRawBody(ctx);
    const data = JSON.parse(body.toString());
    if (!data.tel) {
      throw new ResponseError('请填写验证手机号');
    }
    if (!data.code) {
      throw new ResponseError('请填写验证码');
    }
    // TODO: 加入验证逻辑
    ctx.session.verifiedPhone = data.tel;
    return success();
  }

  @get('/verify')
  async getVerify(ctx) {
    return success(ctx.session.verifiedPhone);
  }
}
