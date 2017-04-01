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
            group_concat(json_object('id', id, 'organizationname', organizationname)),
            ']'
          )
        from t_organization as o2 where o2.parentId=o1.id
        order by o2.seq
      ) as children
    from t_organization as o1
    where o1.accountid = ? and o1.parentId = ''
    order by o1.seq
    `, [ctx.session.communityId]);
        return routes_1.success(ret);
    }
    async item(ctx) {
        let ret = await db_1.Table.Organization.where('id', ctx.params.id).first();
        return routes_1.success(ret);
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
    async join(ctx) {
        let user = await db_1.Table.WechatUser.where({
            officialAccountId: ctx.session.communityId,
            userId: ctx.session.userId,
        }).first();
        let data = await utils_1.getJsonBody(ctx);
        data.id = utils_1.uuid();
        data.username = data.realname = data.name;
        data.organizationid = ctx.params.id;
        data.subuserid = user.id;
        data.status = 'submit';
        data.roleId = 1;
        delete data.name;
        await db_1.Table.OrganizationUser.insert(data);
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
OrganizationController = __decorate([
    routes_1.router('/organization')
], OrganizationController);
exports.OrganizationController = OrganizationController;
