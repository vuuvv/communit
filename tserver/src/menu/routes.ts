import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table, db, raw, first } from '../db';
import { create } from '../utils';
import { getStore } from '../store';
import { Product } from '../models';

@router('/menu')
export class MenuController {
  @get('/bank')
  @login
  async bank(ctx) {
    let ret = await Table.BankMenu.orderBy('sort');
    return success(ret);
  }

  @get('/community')
  @login
  async community(ctx) {
    let ret = await raw(
      'select name, IMAGE_HREF as image from weixin_cms_menu where accountid = ? and (parentmenuid is null or parentmenuid = "") order by seq',
      ctx.session.communityId
    );
    return success(ret);
  }
}
