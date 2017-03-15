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
        let ret = await db_1.Table.Organization.where({
            accountid: ctx.session.communityId,
            organtype: ctx.params.id,
        }).orderBy('organizationname');
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
        let data = await utils_1.getJsonBody(ctx);
        data.id = utils_1.uuid();
        data.username = data.realname = data.name;
        data.organizationid = ctx.params.id;
        delete data.name;
        await db_1.Table.OrganizationUser.insert(data);
        return routes_1.success();
    }
};
__decorate([
    routes_1.get('/type/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "type", null);
__decorate([
    routes_1.get('/item/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "item", null);
__decorate([
    routes_1.get('/:id/users'),
    routes_1.login,
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
