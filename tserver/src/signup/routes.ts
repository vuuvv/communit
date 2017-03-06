import { router, get, post, all, success, error, Response, ResponseError, login } from '../routes';
import { getRawBody } from '../utils';
import { db, Table } from '../db';
import { uuid } from '../utils';

@router('/signup')
export class SignupController　{
  /**
   * 用户填写注册信息, 生成用户
   */
  @post('/create')
  async signup(ctx) {
    const wechatAccountId = ctx.session.communityId;
    const tel = ctx.session.verifiedPhone;
    const wechatUserId = ctx.session.wechatUserId;

    let account = await Table.WechatOfficialAccount.where('id', wechatAccountId);
    if (!account) {
      throw new ResponseError('无效的公众号: ' + wechatAccountId);
    }
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
      let user = await Table.User.transacting(trx).where('username', tel).forUpdate().first();
      if (user) {
        // 用户已存在, 检查在该社区是否存在
        let wechatUser = await Table.WechatUser.transacting(trx).where({
          userId: user.id,
          officialAccountId: wechatAccountId,
        });
        if (wechatUser) {
          throw new ResponseError('用户已存在');
        }
        await Table.WechatUser.transacting(trx).where('id', wechatUser.id).update({
          userId: user.id,
          realname: model.name,
          area: model.area,
          address: model.address,
        });
      }

      let userId = uuid();

      let ids = await Table.User.transacting(trx).insert({
        ID: userId,
        username: tel,
      }).select('ID');
      if (wechatUserId) {
        let wUser = await Table.WechatUser.where('id', wechatUserId).first();
        if (wUser) {
          await Table.WechatUser.transacting(trx).where('id', wechatUserId).update({
            userId: userId,
            realname: model.name,
            area: model.area,
            address: model.address,
          });
        }
      }
      ctx.session.userId = userId;
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

  @get('/crash')
  async crash() {
    process.nextTick(() => {
      throw new Error('application crash test');
    });
  }

  @get('/login')
  async login(ctx) {
    const user = await Table.WechatUser.first();
    ctx.session.userId = user.userId;
    ctx.session.communityId = user.officialAccountId;
    console.log(user.userId, user.officialAccountId);
    return user;
  }
}
