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
const config_1 = require("../config");
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
        let user = await db_1.first(`
    select
      wu.headimgurl as avatar, wu.realname as name, wa.accountname as community, wa.id as communityId, wu.userId
    from t_wechat_user as wu
    join weixin_account as wa on wu.officialAccountId=wa.id
    where wu.officialAccountId=? and wu.userId=?
    `, [communityId, userId]);
        let balance = await db_1.first(`
    select sum(a.balance) as balance from t_account as a
    where a.communityId = ? and a.userId = ?
    `, [communityId, userId]);
        let points = await db_1.first(`
    select sum(total) as points from t_account_detail
    where communityId = ? and userId = ?
    `, [communityId, userId]);
        let store = await db_1.Table.Store.where({ communityId, userId }).first();
        user.balance = balance ? (balance.balance || 0) : 0;
        user.points = points ? (points.points || 0) : 0;
        return routes_1.success({
            user,
            store,
        });
    }
    async profile(ctx) {
        let sql = `
    select
      wu.realname, wu.sex, wu.address, wu.area, wu.address, bu.username as phone, bt.name as biotope,
      su.wenHuaChengDu, su.zhiYeZiGe, su.biYeYuanXiao, su.shenFenZheng, su.birth, su.political,
      su.jianKuanZK, su.JianKangLB, su.fuWuXingJi, su.geRenTZ from t_wechat_user as wu
    join t_s_user as su on wu.userId=su.id
    join t_s_base_user as bu on su.id=bu.id
    left join t_biotope as bt on wu.biotope=bt.id
    where wu.officialAccountId=? and wu.userId=?
    `;
        let ret = await db_1.first(sql, [ctx.session.communityId, ctx.session.userId]);
        return routes_1.success(ret);
    }
    async community(ctx) {
        return routes_1.success(ctx.session.communityId);
    }
    async organizations(ctx) {
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        let ret = await db_1.raw(`
    select o.* from t_organuser as ou
    join t_wechat_user as wu on ou.subuserid = wu.id
    join t_organization as o on ou.organizationid = o.id
    where wu.officialAccountId = ? and wu.userId = ?
    `, [communityId, userId]);
        if (!ret || !ret.length) {
            throw new Error('您并非社工人员');
        }
        return routes_1.success(ret);
    }
    async biotype(ctx) {
        let communityId = ctx.session.communityId;
        let ret = await db_1.raw(`
      select * from t_biotope where communityId = ? order by sort
    `, [communityId]);
        return routes_1.success(ret);
    }
    async workers(ctx) {
        let workers = await db_1.raw(`
    select ou.*, o.organizationname from t_organuser as ou
    join t_wechat_user as wu on ou.subuserid = wu.id
    join t_organization as o on o.id = ou.organizationid
    where wu.officialAccountId = ? and wu.userId = ?
    `, [ctx.session.communityId, ctx.session.userId]);
        return routes_1.success(workers);
    }
    async userId(ctx) {
        return routes_1.success(ctx.session.userId);
    }
    async hello() {
        return 'hello';
    }
    async addAccount(ctx) {
        let user = await db_1.Table.WechatUser.where({
            userId: ctx.session.userId,
            officialAccountId: ctx.session.communityId,
        }).first();
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
    async logout(ctx) {
        delete ctx.session.userId;
        const config = await config_1.Config.instance();
        ctx.redirect(config.site.client);
    }
    async points(ctx) {
        let type = ctx.params.type;
        if (type === 'activity') {
        }
        else {
        }
    }
};
__decorate([
    routes_1.get('/carousel'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "carousel", null);
__decorate([
    routes_1.get('/logo'),
    routes_1.wechat,
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
    routes_1.get('/profile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "profile", null);
__decorate([
    routes_1.get('/community'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "community", null);
__decorate([
    routes_1.get('/organizations'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "organizations", null);
__decorate([
    routes_1.get('/biotope'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "biotype", null);
__decorate([
    routes_1.get('/workers'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "workers", null);
__decorate([
    routes_1.get('/id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userId", null);
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
__decorate([
    routes_1.get('/logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    routes_1.get('/points/:type'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "points", null);
UserController = __decorate([
    routes_1.router('/user')
], UserController);
exports.UserController = UserController;
