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
const account_1 = require("../account");
let UserController = class UserController {
    async carousel(ctx) {
        let communityId = ctx.session.communityId;
        let ret = await db_1.Table.Carousel.where('ACCOUNTID', communityId).select('IMAGE_HREF as image');
        return routes_1.success(ret);
    }
    async logo(ctx) {
        let account = await db_1.Table.WechatOfficialAccount.where('id', ctx.session.communityId).first().select('logo');
        return routes_1.success(account);
    }
    async me(ctx) {
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        if (!communityId) {
            throw new routes_1.ResponseError('没有社区信息, 请退出后重新从微信进入');
        }
        let user = await db_1.first(`
    select wu.headimgurl as avatar, wu.realname as name, wa.accountname as community from t_wechat_user as wu
    join weixin_account as wa on wu.officialAccountId=wa.id
    where wu.officialAccountId=? and wu.userId=?
    `, [communityId, userId]);
        let account = await db_1.raw(`
    select a.*, at.name from t_account as a join t_account_type as at on a.typeId = at.id
    where a.communityId = ? and a.userId = ?
    `, [communityId, userId]);
        return routes_1.success({
            user,
            account,
        });
    }
    async hello() {
        return 'hello';
    }
    async addAccount(ctx) {
        let user = await db_1.Table.WechatUser.orderBy('createdAt').first();
        await db_1.db.transaction(async (trx) => {
            await account_1.addPoints(trx, user.officialAccountId, user.userId, 'c7892688f90948e28008f82dbbd7f648', '68c5a973a00c4f33a10b9ae9d60879fa', 100);
        });
        return routes_1.success();
    }
    async deductAccount() {
        let user = await db_1.Table.WechatUser.first();
        await db_1.db.transaction(async (trx) => {
            await account_1.deductPoints(trx, user.officialAccountId, user.userId, '68c5a973a00c4f33a10b9ae9d60879fa', 13160);
        });
        return routes_1.success();
    }
    async reverse(ctx) {
        await db_1.db.transaction(async (trx) => {
            await account_1.reverseTransaction(trx, ctx.params.id);
        });
        return routes_1.success();
    }
};
__decorate([
    routes_1.get('/carousel'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "carousel", null);
__decorate([
    routes_1.get('/logo'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logo", null);
__decorate([
    routes_1.get('/me'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "me", null);
__decorate([
    routes_1.get('/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "hello", null);
__decorate([
    routes_1.get('/add/account'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addAccount", null);
__decorate([
    routes_1.get('/deduct/account'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deductAccount", null);
__decorate([
    routes_1.get('/reverse/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "reverse", null);
UserController = __decorate([
    routes_1.router('/user')
], UserController);
exports.UserController = UserController;
