import { router, get, post, all, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, db, raw, first } from '../db';
import { create } from '../utils';

@router('/articles')
export class ArticlesController {
  @get('/home')
  @wechat
  async home(ctx) {
    let ret = await raw(`
      select a.id, a.title, a.summary as \`desc\`, a.create_date as date, m.name as type from weixin_cms_article as a
      join weixin_cms_menu as m on m.id=a.column_id
      where m.accountid=? order by a.create_date desc
      limit 10
    `, [ctx.session.communityId]);
    return success(ret);
  }

  @get('/:id')
  async item(ctx) {
    const id = ctx.params.id;
    let category = await first('select name from weixin_cms_menu where id=?', [id]);
    let ret = await raw('select id, title, summary as `desc`, left(create_date, 10) as date from weixin_cms_article where column_id=? order by create_date desc', [id]);
    return success({
      category: category.name,
      list: ret,
    });
  }
}

@router('/article')
export class ArticleController {
  @get('/:id')
  async item(ctx) {
    const id = ctx.params.id;
    let article = await first(`
    select wa.id, wa.title, mm.name as category, wa.content, wa.create_name as \`from\` from weixin_cms_article as wa
    join weixin_cms_menu as mm on wa.column_id = mm.id
    where wa.id = ?
    `, [ctx.params.id]);
    return success(article);
  }
}
