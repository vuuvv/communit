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
async function getStore(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    if (!communityId) {
        throw new routes_1.ResponseError('没有社区信息, 请退出后重新进入');
    }
    return await db_1.Table.Store.where({
        communityId: communityId,
        userId: userId,
    }).first();
}
async function getStoreModel(ctx) {
    let store = await utils_1.getJsonBody(ctx);
    if (!store.name) {
        throw new routes_1.ResponseError('请填写店铺名称');
    }
    if (!store.tel) {
        throw new routes_1.ResponseError('请填写联系电话');
    }
    if (!store.contact) {
        throw new routes_1.ResponseError('请填写联系人');
    }
    if (!store.address) {
        throw new routes_1.ResponseError('请填写店铺地址');
    }
    if (!store.description) {
        throw new routes_1.ResponseError('请填写店铺简介');
    }
    return store;
}
let StoreController = class StoreController {
    async store(ctx) {
        let ret = {};
        ret.store = await getStore(ctx);
        if (ret.store) {
            ret.products = await db_1.Table.Product.where('storeId', ret.store.id).orderBy('updatedAt', 'desc');
        }
        return routes_1.success(ret);
    }
    async add(ctx) {
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        if (!communityId) {
            throw new routes_1.ResponseError('没有社区信息, 请退出后重新从微信进入');
        }
        let user = await db_1.Table.WechatUser.where({
            officialAccountId: communityId,
            userId: userId,
        }).first();
        if (!user) {
            throw new routes_1.ResponseError('用户和社区不匹配，请关闭页面后重新进入');
        }
        let model = await getStoreModel(ctx);
        await db_1.db.transaction(async (trx) => {
            let store = await db_1.Table.Store.where({
                communityId: communityId,
                userId: userId,
            }).forUpdate().first();
            if (store) {
                throw new routes_1.ResponseError('您已经在本社区有店铺了, 不允许重复开店');
            }
            let entity = utils_1.create(models_1.Store, model);
            entity.userId = userId;
            entity.communityId = communityId;
            await db_1.Table.Store.transacting(trx).insert(entity);
        });
        return routes_1.success();
    }
    async edit(ctx) {
        let model = await getStoreModel(ctx);
        let store = await getStore(ctx);
        if (!store) {
            throw new routes_1.ResponseError('您现在还没有店铺');
        }
        if (store.status !== 'normal') {
            throw new routes_1.ResponseError('店铺的状态不正常，不能修改店铺信息');
        }
        await db_1.Table.Store.update({
            id: model.id,
            name: model.name,
            tel: model.tel,
            contact: model.contact,
            description: model.description,
            address: model.address,
        });
        return routes_1.success();
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
__decorate([
    routes_1.post('/edit'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "edit", null);
StoreController = __decorate([
    routes_1.router('/store')
], StoreController);
exports.StoreController = StoreController;
