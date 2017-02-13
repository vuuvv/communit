import * as request from 'request-promise';
import { router, get, all } from '../routes';
import { Table } from '../db';
import { Wechat } from './wechat';

@router('/wechat')
export class WechatController {
  @get('/entry/:id')
  async test(ctx) {
    const id = ctx.params.id;
    const ret = Table.WechatOfficialAccount.first();
    return ret;
  }

  @all('/notify/:id')
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

  @get('/url')
  async url() {
    return await request('http://www.taobao.com');
  }

  @get('/redirect')
  redirect(ctx) {
    ctx.redirect('http://weixin.vuuvv.com/error');
  }
}

