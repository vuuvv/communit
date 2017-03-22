import * as request from 'request-promise';
import * as crypto from 'crypto';
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

    if (!tel) {
      throw new ResponseError('还未验证手机号，请先验证手机号', '10002');
    }

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
          userId: user.id || user.ID,
          officialAccountId: wechatAccountId,
        }).first();
        if (wechatUser) {
          throw new ResponseError('用户已存在');
        }
        await Table.WechatUser.transacting(trx).where('id', wechatUserId).update({
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

  @get('/verify/send')
  async sendVerifyCode(ctx) {
    let phone = ctx.query.phone;
    if (!phone) {
      throw new ResponseError('请填写手机号');
    }
    let secret = '974F9794089F41598DBF8F441B693156';
    let h = crypto.createHmac('sha1', secret);
    let callid = uuid();
    h.update(callid);
    let signature = h.digest('hex').toUpperCase();

    let ret = await request(
      `http://www.crowdnear.com/pc/api.do?route&method=sendMsg&callId=${callid}&appId=zengying&signature=${signature}&phone=${phone}`,
      {json: true}
    );

    if (ret.success) {
      ctx.session.verified = ret.attributes;
      return success();
    }
    throw new ResponseError(ret.msg);
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
    let verify = ctx.session.verified;
    if (!verify) {
      throw new ResponseError('认证失败，请重新发送短信验证');
    }
    if (data.tel !== verify.phone) {
      throw new ResponseError('错误的手机号');
    }
    if (data.code !== verify.verifyCode) {
      throw new ResponseError('错误的验证码');
    }
    ctx.session.verifiedPhone = data.tel;
    delete ctx.session.verified;
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

  @get('/login/:id')
  async login(ctx) {
    const user = await Table.WechatUser.where('id', ctx.params.id).first();
    ctx.session.userId = user.userId;
    ctx.session.communityId = user.officialAccountId;
    return user;
  }
}
