import * as request from 'request-promise';
import * as qs from 'querystring';
import { router, get, post, all, success, Response, ResponseError } from '../routes';
import { Table } from '../db';
import { Wechat } from './wechat';
import { create } from '../utils';
import { WechatOfficialAccount } from '../models';
import { Config } from '../config';

const HOST = 'http://192.168.1.19:4200';

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
    const config = await Config.instance();
    ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?' + qs.stringify({
      appid: wechat.appId,
      redirect_uri: `${config.site.host}/${id}/login`,
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
      console.error(token);
      throw new ResponseError('获取用户token失败');
    }
    let wechatUser = await wechat.getWechatUser(token.openid);
    if (!wechatUser) {
      throw new ResponseError(`公众号${wechat.officialAccount.name}无此微信用户: ${token.openid}`);
    }
    ctx.session.wechatUserId = wechatUser.id;
    const config = await Config.instance();
    if (!wechatUser.userId) {
      ctx.redirect(`${config.site.client}/#/user/verify`);
    } else {
      ctx.session.userId = wechatUser.userId;
      ctx.redirect(config.site.client);
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

