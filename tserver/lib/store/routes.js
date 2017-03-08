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
let StoreController = class StoreController {
    async store(ctx) {
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        if (!communityId) {
            throw new routes_1.ResponseError('没有社区信息, 请退出后重新从微信进入');
        }
        let store = await db_1.raw(`
    select * from t_store
    where communityId=? and userId=?
    `, [communityId, userId]);
        return routes_1.success(store);
    }
    async add(ctx) {
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        if (!communityId) {
            throw new routes_1.ResponseError('没有社区信息, 请退出后重新从微信进入');
        }
        let store = await db_1.raw(`
    select * from t_store
    where communityId=? and userId=?
    `, [communityId, userId]);
        if (!store.name) {
        }
    }
};
__decorate([
    routes_1.get('/'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "store", null);
__decorate([
    routes_1.post('/add'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "add", null);
StoreController = __decorate([
    routes_1.router('/store')
], StoreController);
exports.StoreController = StoreController;
