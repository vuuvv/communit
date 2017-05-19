import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, db, raw, first } from '../db';
import { uuid, create, getJsonBody } from '../utils';
import { getStore } from '../store';
import { Product, Thread, ThreadComment, ThreadRank } from '../models';
import { Wechat } from '../wechat';

@router('/organization')
export class OrganizationController {
  @get('/children/:id')
  @wechat
  async type(ctx) {
    let organization = await Table.Organization.where('id', ctx.params.id).first();
    let children = await Table.Organization.where({
      parentId: ctx.params.id,
    }).orderBy('seq');
    return success({
      organization,
      children
    });
  }

  @get('/home')
  @wechat
  async home(ctx) {
    let ret: any = {};
    await db.transaction(async (trx) => {
      await raw('SET SESSION group_concat_max_len = 1000000', [], trx);
      ret.organizations = await raw(`
      select
        id, organizationname, (
          select
            concat(
              '[',
              group_concat(
                json_object(
                  'id', id,
                  'organizationname', organizationname,
                  'image', image_href,
                  'threads', (select count(*) from t_thread as t where t.organizationId=o2.id),
                  'members', (select count(*) from t_organuser as t where t.organizationId=o2.id)
                )
              ),
              ']'
            )
          from t_organization as o2 where o2.parentId=o1.id
          order by o2.seq
        ) as children
      from t_organization as o1
      where o1.accountid = ? and (o1.parentId = '' or o1.parentId is null)
      order by o1.seq
      `, [ctx.session.communityId], trx);
    });

    ret.threads = await Table.Thread.where('communityId', ctx.session.communityId).orderBy('lastCommentTime').limit(3);
    return success(ret);
  }

  @get('/item/:id')
  @wechat
  async item(ctx) {
    const organizationId = ctx.params.id;
    const sql = `
    select
      o.id,
      o.organizationname as name,
      o.description,
      (select count(*) from t_organuser as ou1 where ou1.organizationId=o.id) as userCount
    from t_organization as o
    where o.id = ?
    `;
    let org = await first(sql, [organizationId]);
    if (!org) {
      throw new Error('无此社工机构');
    }

    if (ctx.session.userId) {
      org.isJoined = !!(await first(`
      select * from t_wechat_user as wu
      join t_organuser as ou on wu.id=ou.subuserid
      join t_organization as o on ou.organizationId=o.id
      where wu.officialAccountId = ? and wu.userId = ? and o.id = ?
      `, [ctx.session.communityId, ctx.session.userId, organizationId]));
    } else {
      org.isJoined = false;
    }


    org.threads = await raw(`
    select
      t.*, wu.realname, wu.headimgurl ,
      (select count(*) from t_thread_rank as tr1 where tr1.threadId=t.id and tr1.rank=1) as goodCount,
      (select count(*) from t_thread_rank as tr2 where tr2.threadId=t.id and tr2.rank=-1) as badCount,
      (select count(*) from t_thread_comment as tc where tc.threadId=t.id) as commentCount
    from t_thread as t
    join t_wechat_user as wu on t.communityId = wu.officialAccountId and t.userId = wu.userId
    where t.organizationId = ? and t.status = 'online'
    order by t.lastCommentTime desc
    `, [organizationId]);

    return success(org);
  }

  @get('/:id/users')
  @wechat
  async users(ctx) {
    let ret = await Table.OrganizationUser.where({
      organizationid: ctx.params.id,
    }).orderBy('realname');
    return success(ret);
  }

  @get('/joined/:id')
  @login
  async joined(ctx) {
    let user = await Table.WechatUser.where({
      officialAccountId: ctx.session.communityId,
      userId: ctx.session.userId,
    }).first();

    let ouser = await Table.OrganizationUser.where({
      organizationid: ctx.params.id,
      subuserid: user.id,
    }).first();

    return success(ouser);
  }

/*
  @post('/join/:id')
  @login
  async join(ctx) {
    let user = await Table.WechatUser.where({
      officialAccountId: ctx.session.communityId,
      userId: ctx.session.userId,
    }).first();

    let data = await getJsonBody(ctx);
    data.id = uuid();
    data.username = data.realname = data.name;
    data.organizationid = ctx.params.id;
    data.subuserid = user.id;
    data.status = 'submit';
    data.roleId = 1;
    delete data.name;
    await Table.OrganizationUser.insert(data);
    return success();
  }
*/

  @post('/join/:id')
  @login
  async join(ctx) {
    let organizationId = ctx.params.id;

    let org = await Table.Organization.where('id', ctx.params.id).first();
    if (!org) {
      throw new Error('无效的社工机构');
    }


    let user = await Table.WechatUser.where({
      officialAccountId: ctx.session.communityId,
      userId: ctx.session.userId,
    }).first();

    await db.transaction(async (trx) => {
      const orgUser = await Table.OrganizationUser.transacting(trx).forUpdate().where({
        organizationId,
        subuserid: user.id
      }).first();

      if (orgUser) {
        throw new Error('您已经加入了该社区');
      }

      await Table.OrganizationUser.transacting(trx).insert({
        id: uuid(),
        organizationId,
        subuserid: user.id,
        username: user.realname,
        roleId: 1,
        status: 'submit',
      });
    });
    return success();
  }

  @post('/quit/:id')
  @login
  async quit(ctx) {
    let organizationId = ctx.params.id;

    let org = await Table.Organization.where('id', ctx.params.id).first();
    if (!org) {
      throw new Error('无效的社工机构');
    }

    let user = await Table.WechatUser.where({
      officialAccountId: ctx.session.communityId,
      userId: ctx.session.userId,
    }).first();

    await Table.OrganizationUser.where({
      organizationId,
      subuserid: user.id
    }).delete();

    return success();
  }

  @post('/:id/thread/add')
  @login
  async addThread(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;

    let model = await getJsonBody(ctx);
    if (!model.title) {
      throw new Error('请输入标题');
    }
    if (!model.content) {
      throw new Error('请输入内容');
    }

    let org = await Table.Organization.where('id', ctx.params.id).first().select('id');
    if (!org) {
      throw new Error('无效的社工机构');
    }

    await this.checkThreadAndUser(communityId, userId, {organizationId: org.id});

    let entity = new Thread();
    entity.organizationId = ctx.params.id;
    entity.communityId = communityId;
    entity.userId = userId;
    entity.title = model.title;
    entity.content = model.content;


    let wechat = await Wechat.create(communityId);
    let images = await wechat.savePhotos(model.serverIds);
    entity.images = JSON.stringify(images);

    await Table.Thread.insert(entity);

    return success();
  }

  @get('/thread/item/:id')
  async getThread(ctx) {
    let threadId = ctx.params.id;
    let ret = await first(`
    select
      t.*, wu.realname, wu.headimgurl, o.organizationname, tr.rank as rankType,
      (select count(*) from t_thread_rank as tr1 where tr1.threadId=t.id and tr1.rank=1) as goodCount,
      (select count(*) from t_thread_rank as tr2 where tr2.threadId=t.id and tr2.rank=-1) as badCount,
      (select count(*) from t_thread_comment as tc where tc.threadId=t.id) as commentCount
    from t_thread as t
    join t_wechat_user as wu on t.communityId = wu.officialAccountId and t.userId = wu.userId
    join t_organization as o on o.id = t.organizationId
    left join t_thread_rank as tr on tr.threadId = t.id and tr.communityId = ? and tr.userId = ?
    where t.id = ?
    `, [ctx.session.communityId, ctx.session.userId || null, threadId]);

    ret.comments = await raw(`
    select tc.*, wu.realname, wu.headimgurl
    from t_thread_comment as tc
    join t_wechat_user as wu on tc.communityId=wu.officialAccountId and tc.userId=wu.userId
    where tc.threadId = ?
    order by tc.createdAt desc
    `, [threadId]);

    return success(ret);
  }

  async checkThreadAndUser(communityId, userId, thread) {
    if (!thread) {
      throw new Error('无效的主题贴');
    }

    console.log(thread);

    let user = await first(`
    select * from t_organuser as ou
    join t_wechat_user as wu on ou.subuserid = wu.id
    where wu.officialAccountId = ? and wu.userId = ? and ou.organizationId = ?
    `, [communityId, userId, thread.organizationId]);
    if (!user) {
      throw new Error('请先加入该社工机构');
    }
    return !!user;
  }

  async rank(threadId: string, type: number, communityId: string, userId: string) {
    let thread = await Table.Thread.where('id', threadId).first();
    await this.checkThreadAndUser(communityId, userId, thread);

    await db.transaction(async (trx) => {
      let rank = await Table.ThreadRank.transacting(trx).where({
        threadId,
        communityId,
        userId,
      }).first();

      if (rank) {
        if (rank.rank === type) {
          await Table.ThreadRank.transacting(trx).where('id', rank.id).delete();
          type = 0;
        } else {
          await Table.ThreadRank.transacting(trx).where('id', rank.id).update({
            rank: type,
          });
        }
      } else {
        await Table.ThreadRank.transacting(trx).insert({
          id: uuid(),
          threadId,
          communityId,
          userId,
          rank: type,
        });
      }
    });
    return type;
  }

  @post('/thread/item/:id/good')
  @login
  async good(ctx) {
    let type = await this.rank(ctx.params.id, 1, ctx.session.communityId, ctx.session.userId);
    return success(type);
  }

  @post('/thread/item/:id/bad')
  @login
  async bad(ctx) {
    let type = await this.rank(ctx.params.id, -1, ctx.session.communityId, ctx.session.userId);
    return success(type);
  }

  @post('/thread/item/:id/comment/add')
  @login
  async addComment(ctx) {
    let threadId = ctx.params.id;
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;

    let model = await getJsonBody(ctx);
    let thread = await Table.Thread.where('id', threadId).first();

    await this.checkThreadAndUser(communityId, userId, thread);

    await Table.ThreadComment.insert({
      id: uuid(),
      threadId,
      communityId: ctx.session.communityId,
      userId: ctx.session.userId,
      content: model.content,
    });
    await Table.Thread.where('id', ctx.params.id).update({
      lastCommentTime: new Date(),
    });
    return success();
  }
}
