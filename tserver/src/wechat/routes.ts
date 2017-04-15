import * as request from 'request-promise';
import * as rawRequest from 'request';
import * as qs from 'querystring';
import * as sha1 from 'sha1';
import * as fs from 'fs';

import { router, get, post, all, success, Response, ResponseError, wechat } from '../routes';
import { Table } from '../db';
import { Wechat } from './wechat';
import { create, getJsonBody, getNonceStr, getTimesTamp, errorPage } from '../utils';
import { WechatOfficialAccount } from '../models';
import { Config } from '../config';

@router('/wechat')
export class WechatController {
  private async getWechat(id) {
    let dbRet = await Table.WechatOfficialAccount.where('id', id).first();
    if (!dbRet) {
      return dbRet;
    }
    return create<WechatOfficialAccount>(WechatOfficialAccount, dbRet);
  }

  @get('/:id/entry')
  async test(ctx) {
    const id = ctx.params.id.trim();
    const wechat = await Wechat.create(id);
    if (!wechat) {
      await errorPage(ctx, '无效的微信公众号');
      return;
    }
    const config = await Config.instance();
    ctx.session.communityId = id;
    delete ctx.session.userId;
    ctx.redirect(wechat.redirectUrl(`${config.site.host}/wechat/login`));
  }

  @get('/login')
  async login(ctx) {
    const wechat = await Wechat.create(ctx.session.communityId);
    const wechatUser = await wechat.login(ctx);
    const config = await Config.instance();
    if (wechatUser.userId) {
      ctx.session.userId = wechatUser.userId;
    }
    ctx.redirect(config.site.client);

    // if (!wechatUser.userId) {
    //   ctx.redirect(`${config.site.client}/#/user/verify`);
    // } else {
    //   ctx.session.userId = wechatUser.userId;
    //   ctx.redirect(config.site.client);
    // }
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

  @post('/signature/jsapi')
  @wechat
  async signature(ctx) {
    const id = ctx.session.communityId;

    const data = await getJsonBody(ctx);
    const wechat = await Wechat.create(id);
    const account = wechat.officialAccount;

    let ticket = await wechat.getJsApiToken();

    let timestamp = getTimesTamp();
    let nonceStr = getNonceStr();

    let str = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${data.url}`;

    return success({
      signature: sha1(str),
      appId: account.appId,
      timestamp,
      nonceStr,
    });
  }

  @get('/url')
  async url() {
    return await request('http://www.163.com');
  }

  @get('/redirect')
  redirect(ctx) {
    ctx.redirect('http://weixin.vuuvv.com/error');
  }

  @get('/media')
  @wechat
  async media(ctx) {
    const id = ctx.session.communityId;
    const wechat = await Wechat.create(id);
    let url = await wechat.saveMedia('4vJ9a4ADDnM7EVN4hXFTZ7qHrI5bvATEqXTq3FLRc5Ev6WH3h-ZgjNl35SOJ1Pkm');
    return success(url);
  }

  @get('/preview/:communityId/:serverId')
  async preview(ctx) {
    const id = ctx.params.communityId;
    const wechat = await Wechat.create(id);
    let ret = await wechat.getMedia(ctx.params.serverId);
    let media: any = await new Promise((resolve, reject) => {
      rawRequest({
        url: 'https://api.weixin.qq.com/cgi-bin/media/get',
        qs: {
          access_token: wechat.officialAccount.accessToken,
          media_id: ctx.params.serverId,
        },
      }).pipe(ctx.res);
    });
  }
}

