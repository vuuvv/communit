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
    let ret = await raw(`
    select
      id, name, image_href as image
    from weixin_bank_menu as m1
    where m1.accountid = ? and (m1.ParentMenuId = '' or m1.ParentMenuId is null)
    order by m1.seq
    `, [ctx.session.communityId]);
    // let ret = await raw(`
    // select
    //   id, name, (
    //     select
    //       concat(
    //         '[',
    //         group_concat(json_object('id', id, 'name', name)),
    //         ']'
    //       )
    //     from t_weixin_bank_menu as m2 where m2.parentId=m1.id
    //     order by m2.seq
    //   ) as children
    // from t_weixin_bank_menu as m1
    // where m1.accountid = ? and (o1.parentId = '' or o1.parentId is null)
    // order by m1.seq
    // `, [ctx.session.communityId]);
    return success(ret);
  }

  @get('/bank/:id/children')
  @wechat
  async bankChildren(ctx) {
    let all: any[] = await raw(`
    select
      id, name, (
        select
          concat(
            '[',
            group_concat(json_object('id', id, 'name', name)),
            ']'
          )
        from weixin_bank_menu as m2 where m2.parentMenuId=m1.id
        order by m2.seq
      ) as children
    from weixin_bank_menu as m1
    where m1.accountid = ? and (m1.parentMenuId = '' or m1.parentMenuId is null)
    order by m1.seq
    `, [ctx.session.communityId]);

    let current = all.find((v) => v.id === ctx.params.id);
    if (!current) {
      throw new Error('无效的公益银行分类');
    }
    // let ret = await raw(`
    // select
    //   id, name, image_href as image
    // from weixin_bank_menu as m1
    // where m1.ParentMenuId = ?
    // order by m1.seq
    // `, [ctx.params.id]);
    return success({
      all,
      current,
    });
  }

  @get('/bank/:id')
  @wechat
  async bankMenu(ctx) {
    let ret = await first(`
    select
      id, name, image_href as image
    from weixin_bank_menu as m1
    where m1.id = ?
    order by m1.seq
    `, [ctx.params.id]);
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
