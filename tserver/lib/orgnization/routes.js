"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const routes_1 = require("../routes");
const db_1 = require("../db");
const utils_1 = require("../utils");
const models_1 = require("../models");
const wechat_1 = require("../wechat");
let OrganizationController = class OrganizationController {
    async type(ctx) {
        let organization = await db_1.Table.Organization.where('id', ctx.params.id).first();
        let children = await db_1.Table.Organization.where({
            parentId: ctx.params.id,
        }).orderBy('seq');
        return routes_1.success({
            organization,
            children
        });
    }
    async home(ctx) {
        let ret = {};
        await db_1.db.transaction(async (trx) => {
            await db_1.raw('SET SESSION group_concat_max_len = 1000000', [], trx);
            ret.organizations = await db_1.raw(`
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
        ret.threads = await db_1.Table.Thread.where('communityId', ctx.session.communityId).orderBy('lastCommentTime').limit(3);
        return routes_1.success(ret);
    }
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
        let org = await db_1.first(sql, [organizationId]);
        if (!org) {
            throw new Error('无此社工机构');
        }
        if (ctx.session.userId) {
            org.isJoined = !!(await db_1.first(`
      select * from t_wechat_user as wu
      join t_organuser as ou on wu.id=ou.subuserid
      join t_organization as o on ou.organizationId=o.id
      where wu.officialAccountId = ? and wu.userId = ? and o.id = ?
      `, [ctx.session.communityId, ctx.session.userId, organizationId]));
        }
        else {
            org.isJoined = false;
        }
        org.threads = await db_1.raw(`
    select
      t.*, wu.realname, wu.headimgurl ,
      (select count(*) from t_thread_rank as tr1 where tr1.threadId=t.id and tr1.rank=1) as goodCount,
      (select count(*) from t_thread_rank as tr2 where tr2.threadId=t.id and tr2.rank=-1) as badCount,
      (select count(*) from t_thread_comment as tc where tc.threadId=t.id) as commentCount
    from t_thread as t
    join t_wechat_user as wu on t.communityId = wu.officialAccountId and t.userId = wu.userId
    where t.organizationId = ?
    order by t.lastCommentTime desc
    `, [organizationId]);
        return routes_1.success(org);
    }
    async users(ctx) {
        let ret = await db_1.Table.OrganizationUser.where({
            organizationid: ctx.params.id,
        }).orderBy('realname');
        return routes_1.success(ret);
    }
    async joined(ctx) {
        let user = await db_1.Table.WechatUser.where({
            officialAccountId: ctx.session.communityId,
            userId: ctx.session.userId,
        }).first();
        let ouser = await db_1.Table.OrganizationUser.where({
            organizationid: ctx.params.id,
            subuserid: user.id,
        }).first();
        return routes_1.success(ouser);
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
    async join(ctx) {
        let organizationId = ctx.params.id;
        let org = await db_1.Table.Organization.where('id', ctx.params.id).first();
        if (!org) {
            throw new Error('无效的社工机构');
        }
        let user = await db_1.Table.WechatUser.where({
            officialAccountId: ctx.session.communityId,
            userId: ctx.session.userId,
        }).first();
        await db_1.db.transaction(async (trx) => {
            const orgUser = await db_1.Table.OrganizationUser.transacting(trx).forUpdate().where({
                organizationId,
                subuserid: user.id
            }).first();
            if (orgUser) {
                throw new Error('您已经加入了该社区');
            }
            await db_1.Table.OrganizationUser.transacting(trx).insert({
                id: utils_1.uuid(),
                organizationId,
                subuserid: user.id,
                username: user.realname,
                roleId: 1,
                status: 'submit',
            });
        });
        return routes_1.success();
    }
    async quit(ctx) {
        let organizationId = ctx.params.id;
        let org = await db_1.Table.Organization.where('id', ctx.params.id).first();
        if (!org) {
            throw new Error('无效的社工机构');
        }
        let user = await db_1.Table.WechatUser.where({
            officialAccountId: ctx.session.communityId,
            userId: ctx.session.userId,
        }).first();
        await db_1.Table.OrganizationUser.where({
            organizationId,
            subuserid: user.id
        }).delete();
        return routes_1.success();
    }
    async addThread(ctx) {
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        let model = await utils_1.getJsonBody(ctx);
        if (!model.title) {
            throw new Error('请输入标题');
        }
        if (!model.content) {
            throw new Error('请输入内容');
        }
        let org = await db_1.Table.Organization.where('id', ctx.params.id).first().select('id');
        if (!org) {
            throw new Error('无效的社工机构');
        }
        await this.checkThreadAndUser(communityId, userId, { organizationId: org.id });
        let entity = new models_1.Thread();
        entity.organizationId = ctx.params.id;
        entity.communityId = communityId;
        entity.userId = userId;
        entity.title = model.title;
        entity.content = model.content;
        let wechat = await wechat_1.Wechat.create(communityId);
        let images = await wechat.savePhotos(model.serverIds);
        entity.images = JSON.stringify(images);
        await db_1.Table.Thread.insert(entity);
        return routes_1.success();
    }
    async getThread(ctx) {
        let threadId = ctx.params.id;
        let ret = await db_1.first(`
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
        ret.comments = await db_1.raw(`
    select tc.*, wu.realname, wu.headimgurl
    from t_thread_comment as tc
    join t_wechat_user as wu on tc.communityId=wu.officialAccountId and tc.userId=wu.userId
    where tc.threadId = ?
    order by tc.createdAt desc
    `, [threadId]);
        return routes_1.success(ret);
    }
    async checkThreadAndUser(communityId, userId, thread) {
        if (!thread) {
            throw new Error('无效的主题贴');
        }
        console.log(thread);
        let user = await db_1.first(`
    select * from t_organuser as ou
    join t_wechat_user as wu on ou.subuserid = wu.id
    where wu.officialAccountId = ? and wu.userId = ? and ou.organizationId = ?
    `, [communityId, userId, thread.organizationId]);
        if (!user) {
            throw new Error('请先加入该社工机构');
        }
        return !!user;
    }
    async rank(threadId, type, communityId, userId) {
        let thread = await db_1.Table.Thread.where('id', threadId).first();
        await this.checkThreadAndUser(communityId, userId, thread);
        await db_1.db.transaction(async (trx) => {
            let rank = await db_1.Table.ThreadRank.transacting(trx).where({
                threadId,
                communityId,
                userId,
            }).first();
            if (rank) {
                if (rank.rank === type) {
                    await db_1.Table.ThreadRank.transacting(trx).where('id', rank.id).delete();
                    type = 0;
                }
                else {
                    await db_1.Table.ThreadRank.transacting(trx).where('id', rank.id).update({
                        rank: type,
                    });
                }
            }
            else {
                await db_1.Table.ThreadRank.transacting(trx).insert({
                    id: utils_1.uuid(),
                    threadId,
                    communityId,
                    userId,
                    rank: type,
                });
            }
        });
        return type;
    }
    async good(ctx) {
        let type = await this.rank(ctx.params.id, 1, ctx.session.communityId, ctx.session.userId);
        return routes_1.success(type);
    }
    async bad(ctx) {
        let type = await this.rank(ctx.params.id, -1, ctx.session.communityId, ctx.session.userId);
        return routes_1.success(type);
    }
    async addComment(ctx) {
        let threadId = ctx.params.id;
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        let model = await utils_1.getJsonBody(ctx);
        let thread = await db_1.Table.Thread.where('id', threadId).first();
        await this.checkThreadAndUser(communityId, userId, thread);
        await db_1.Table.ThreadComment.insert({
            id: utils_1.uuid(),
            threadId,
            communityId: ctx.session.communityId,
            userId: ctx.session.userId,
            content: model.content,
        });
        await db_1.Table.Thread.where('id', ctx.params.id).update({
            lastCommentTime: new Date(),
        });
        return routes_1.success();
    }
};
__decorate([
    routes_1.get('/children/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "type", null);
__decorate([
    routes_1.get('/home'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "home", null);
__decorate([
    routes_1.get('/item/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "item", null);
__decorate([
    routes_1.get('/:id/users'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "users", null);
__decorate([
    routes_1.get('/joined/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "joined", null);
__decorate([
    routes_1.post('/join/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "join", null);
__decorate([
    routes_1.post('/quit/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "quit", null);
__decorate([
    routes_1.post('/:id/thread/add'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "addThread", null);
__decorate([
    routes_1.get('/thread/item/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getThread", null);
__decorate([
    routes_1.post('/thread/item/:id/good'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "good", null);
__decorate([
    routes_1.post('/thread/item/:id/bad'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "bad", null);
__decorate([
    routes_1.post('/thread/item/:id/comment/add'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "addComment", null);
OrganizationController = __decorate([
    routes_1.router('/organization')
], OrganizationController);
exports.OrganizationController = OrganizationController;
