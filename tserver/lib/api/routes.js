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
const account_1 = require("../account");
async function getWechatUser(officialAccountId, userId) {
    return await db_1.Table.WechatUser.where({ officialAccountId, userId }).first();
}
let ApiController = class ApiController {
    async pointsGiveToCommunity(ctx) {
        let data = await utils_1.getJsonBody(ctx);
        let ret = [];
        await db_1.db.transaction(async (trx) => {
            for (let item of data) {
                let tid = await account_1.PayCommunity(trx, item.communityId, item.points);
                ret.push(tid);
            }
        });
        return routes_1.success(ret);
    }
    async pointsGiveToUser(ctx) {
        let data = await utils_1.getJsonBody(ctx);
        let ret = [];
        await db_1.db.transaction(async (trx) => {
            for (let item of data) {
                let oid = await account_1.ChangeActivityUser(trx, item.activityUserId, item.points);
                ret.push(oid);
            }
        });
        return routes_1.success(ret);
    }
    async pointsRefundActivity(ctx) {
        let data = await utils_1.getJsonBody(ctx);
        let ret = [];
        await db_1.db.transaction(async (trx) => {
            for (let item of data) {
                let oid = await account_1.RefundActivityUser(trx, item.activityUserId);
                ret.push(oid);
            }
        });
        return routes_1.success(ret);
    }
    async pointsChangeActivity(ctx) {
        let data = await utils_1.getJsonBody(ctx);
        let ret = [];
        await db_1.db.transaction(async (trx) => {
            for (let item of data) {
                let oid = await account_1.ChangeActivityUser(trx, item.activityUserId, item.points);
                ret.push(oid);
            }
        });
        return routes_1.success(ret);
    }
    async test(ctx) {
        await db_1.db.transaction(async (trx) => {
            let oid = await account_1.ChangeActivityUser(trx, ctx.params.aid, ctx.params.points);
        });
        return routes_1.success();
    }
    async testc(ctx) {
        await db_1.db.transaction(async (trx) => {
            let tid = await account_1.PayCommunity(trx, ctx.params.id, 2000);
        });
        return routes_1.success();
    }
};
__decorate([
    routes_1.post('/points/give/community'),
    routes_1.api,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "pointsGiveToCommunity", null);
__decorate([
    routes_1.post('/points/give/user'),
    routes_1.api,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "pointsGiveToUser", null);
__decorate([
    routes_1.post('/points/refund/activity'),
    routes_1.api,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "pointsRefundActivity", null);
__decorate([
    routes_1.post('/points/change/activity'),
    routes_1.api,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "pointsChangeActivity", null);
__decorate([
    routes_1.get('/test/:aid/:points'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "test", null);
__decorate([
    routes_1.get('/testc/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "testc", null);
ApiController = __decorate([
    routes_1.router('/api')
], ApiController);
exports.ApiController = ApiController;
