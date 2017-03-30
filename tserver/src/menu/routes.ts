import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, db, raw, first } from '../db';
import { create } from '../utils';
import { getStore } from '../store';
import { Product } from '../models';

@router('/menu')
export class MenuController {
  @get('/bank')
  @wechat
  async bank(ctx) {
    let ret = await Table.BankMenu.orderBy('sort');
    return success(ret);
  }

  @get('/community')
  @wechat
  async community(ctx) {
    let ret = await raw(
      `
       select id, name, IMAGE_HREF as image, showType, url from weixin_cms_menu
       where accountid = ? and (parentmenuid is null or parentmenuid = "") order by seq
      `,
      [ctx.session.communityId]
    );
    return success(ret);
  }

  @get('/community/:id')
  @wechat
  async communityChildren(ctx) {
    let parent = await first(`
      select id, name from weixin_cms_menu where id = ?
    `, [ctx.params.id]);
    let children = await raw(
      `
       select id, name from weixin_cms_menu
       where accountid = ? and parentmenuid = ? order by seq
      `,
      [ctx.session.communityId, ctx.params.id]
    );
    return success({
      parent,
      children,
    });
  }
}
