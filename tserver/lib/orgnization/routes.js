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
        let ret = await db_1.raw(`
    select
      id, organizationname, (
        select
          concat(
            '[',
            group_concat(json_object('id', id, 'organizationname', organizationname, 'image', image_href)),
            ']'
          )
        from t_organization as o2 where o2.parentId=o1.id
        order by o2.seq
      ) as children
    from t_organization as o1
    where o1.accountid = ? and (o1.parentId = '' or o1.parentId is null)
    order by o1.seq
    `, [ctx.session.communityId]);
        return routes_1.success(ret);
    }
    async item(ctx) {
        const sql = `
    select
      o.id,
      o.organizationname as name,
      o.description,
      (select count(*) from t_organuser as ou1 where ou1.organizationId=o.id) as userCount
    from t_organization as o
    where o.id = ?
    `;
        let org = await db_1.first(sql, [ctx.params.id]);
        if (!org) {
            throw new Error('无此社工机构');
        }
        org.isJoined = !!(await db_1.first(`
    select * from t_wechat_user as wu
    join t_organuser as ou on wu.id=ou.subuserid
    join t_organization as o on ou.organizationId=o.id
    where wu.officialAccountId = ? and wu.userId = ? and o.id = ?
    `, [ctx.session.communityId, ctx.session.userId, ctx.params.id]));
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
OrganizationController = __decorate([
    routes_1.router('/organization')
], OrganizationController);
exports.OrganizationController = OrganizationController;
