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
const url = require("url");
const routes_1 = require("../routes");
const db_1 = require("../db");
const utils_1 = require("../utils");
const models_1 = require("../models");
const store_1 = require("./store");
const account_1 = require("../account");
const wechat_1 = require("../wechat");
function sumif(array, fn) {
    let ret = 0;
    array.forEach((item) => {
        if (fn(item)) {
            ret += item.amount || 0;
        }
    });
    return ret;
}
function getServerId(uri) {
    let u = url.parse(uri);
    return u.pathname.substr(u.pathname.lastIndexOf('/') + 1);
}
let StoreController = class StoreController {
    async store(ctx) {
        let ret = {};
        let communityId = ctx.session.communityId;
        ret.store = await store_1.getStore(ctx);
        if (ret.store) {
            // ret.products = await Table.Product.where('storeId', ret.store.id).orderBy('updatedAt', 'desc');
            ret.products = await db_1.raw(`
      select p.*, c.icon as categoryIcon, c.name as categoryName, c.id as categoryId from t_product as p
      join t_product_category as c on p.categoryId = c.id
      where p.storeId = ?
      order by p.updatedAt desc
      `, [ret.store.id]);
            ret.orders = await db_1.raw(`
      select o.*, s.name from t_order as o
      join t_store as s on o.sellerId = s.id
      where s.userId = ? and s.communityId = ?
      order by o.updatedAt desc
      `, [ctx.session.userId, communityId]);
            if (ret.orders.length) {
                let details = await db_1.raw(`
        select * from t_order_detail where orderId in (?)
        `, [ret.orders.map((v) => v.id)]);
                for (let o of ret.orders) {
                    o.details = details.filter((d) => o.id === d.orderId);
                }
            }
            let balance = await db_1.raw(`
      select at.id, at.name as typeName, if(a.balance is null, 0, a.balance) as amount from t_account_type as at
      left join t_account a on a.typeId=at.id and a.userId = ?
      group by at.id
      `, [ret.store.id]);
            let total = await db_1.raw(`
      select at.id, at.name, sum(if(a.total is null, 0, a.total)) as amount from t_account_type as at
      left join t_account_detail as a on at.id = a.typeId and a.userId = ?
      group by at.id
      `, [ret.store.id]);
            let orderCount = (await db_1.first('select count(*) as c from t_order where sellerId = ?', [ret.store.id])).c || 0;
            ret.accounts = {
                storeBalance: sumif(balance, (item) => item.id === account_1.AccountType.Store),
                storeTotal: sumif(total, (item) => item.id === account_1.AccountType.Store),
                buyBalance: sumif(balance, (item) => item.id === account_1.AccountType.Buy),
                buyTotal: sumif(total, (item) => item.id === account_1.AccountType.Buy),
            };
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
        let model = await store_1.getStoreModel(ctx);
        let wechat = await wechat_1.Wechat.create(communityId);
        await db_1.db.transaction(async (trx) => {
            let store = await db_1.Table.Store.transacting(trx).where({
                communityId: communityId,
                userId: userId,
            }).forUpdate().first();
            if (store) {
                throw new routes_1.ResponseError('您已经在本社区有店铺了, 不允许重复开店');
            }
            let entity = utils_1.create(models_1.Store, model);
            entity.userId = userId;
            entity.communityId = communityId;
            entity.businessLicense = await wechat.saveMedia(model.businessLicense);
            entity.legalRepresentativeIdPicture = await wechat.saveMedia(model.legalRepresentativeIdPicture);
            await db_1.Table.Store.transacting(trx).insert(entity);
        });
        return routes_1.success();
    }
    async edit(ctx) {
        let model = await store_1.getStoreModel(ctx);
        let store = await store_1.getStore(ctx);
        if (!store) {
            throw new routes_1.ResponseError('您现在还没有店铺');
        }
        if (store.status !== 'normal') {
            throw new routes_1.ResponseError('店铺的状态不正常，不能修改店铺信息');
        }
        await db_1.Table.Store.where('id', store.id).update({
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
