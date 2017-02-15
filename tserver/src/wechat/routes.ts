import * as request from 'request-promise';
import * as qs from 'querystring';
import { router, get, post, all, success, Response, ResponseError } from '../routes';
import { Table } from '../db';
import { Wechat } from './wechat';
import { create } from '../utils';
import { WechatOfficialAccount } from '../models';

const HOST = 'http://192.168.1.12:4200';

@router('/wechat')
export class WechatController {
  private async getWechat(id) {
    let dbRet = await Table.WechatOfficialAccount.where('id', id).first();
    return create<WechatOfficialAccount>(WechatOfficialAccount, dbRet);
  }

  @get('/:id/entry')
  async test(ctx) {
    const id = ctx.params.id;
    const wechat = await this.getWechat(id);
    ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?' + qs.stringify({
      appid: wechat.appId,
      redirect_uri: `http://weixin.vuuvv.com/wechat/${id}/login`,
      response_type: 'code',
      scope: 'snsapi_base',
      state: '123'
    }) + '#wechat_redirect');
  }


  @get('/:id/login')
  async login(ctx) {
    const id = ctx.params.id;
    const code = ctx.query.code;
    const wechat = await Wechat.create(id);
    const token = await wechat.getUserAccessToken(code);
    if (!token.openid) {
      throw new ResponseError('获取用户token失败');
    }
    let wechatUser = await wechat.getWechatUser(token.openid);
    if (!wechatUser) {
      throw new ResponseError(`公众号${wechat.officialAccount.name}无此微信用户: ${token.openid}`);
    }
    ctx.session.wechatUserId = wechatUser.id;
    if (!wechatUser.userId) {
      ctx.redirect(`${HOST}/#/user/verify`);
    } else {
      ctx.session.userId = wechatUser.userId;
      ctx.redirect(HOST);
    }
  }

  @all('/:id/notify')
  async notify(ctx) {
    const id = ctx.params.id;
    const wechat = await Wechat.create(id);
    const query = ctx.query;
    if (!wechat.checkSignature(query)) {
      ctx.status = 401;
      ctx.body = 'Invalid signature';
      return;
    }

    if (ctx.method === 'GET') {
      return query.echostr;
    } else if (ctx.method === 'POST') {
      return wechat.dispatch(ctx);
    }
  }

  @post('/:id/menu')
  async createMenu(ctx): Promise<Response> {
    const id = ctx.params.id;
    const wechat = await Wechat.create(id);
    const ret = await wechat.createMenu({
      'button': [
        {
          'type': 'view',
          'name': '进入众邻',
          'url': `http://weixin.vuuvv.com/wechat/${id}/entry`
        }
      ]
    });
    console.log(ret);
    return success(ret);
  }

  @get('/url')
  async url() {
    return await request('http://www.163.com');
  }

  @get('/redirect')
  redirect(ctx) {
    ctx.redirect('http://weixin.vuuvv.com/error');
  }

}

