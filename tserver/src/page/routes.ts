import * as _ from 'lodash';

import { router, get, post, success, Response, ResponseError, login } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody, errorPage } from '../utils';
import { Account, Product, Qrcode } from '../models';
import { Wechat } from '../wechat';
import { Config } from '../config';
import { successPage } from '../utils';

@router('/page')
export class PageController {
  /**
   * 错误提示页面
   * @param ctx
   */
  @get('/error')
  @login
  async error(ctx) {
    ctx.state = {
      title: 'app'
    };

    console.log('here');
    await ctx.render('error', { message: 'John' });
  }

  @get('/ok')
  @login
  async ok(ctx) {
    await successPage(ctx, '操作成功', '订单交易成功');
  }
}
