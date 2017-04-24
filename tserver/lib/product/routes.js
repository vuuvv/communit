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
const _ = require("lodash");
const ejs = require("ejs");
const routes_1 = require("../routes");
const db_1 = require("../db");
const utils_1 = require("../utils");
const store_1 = require("../store");
const product_1 = require("./product");
const wechat_1 = require("../wechat");
const models_1 = require("../models");
let ProductController = class ProductController {
    async category(ctx) {
        let ret = await db_1.Table.ProductCategory.orderBy('sort');
        return routes_1.success(ret);
    }
    async list(ctx) {
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        let sql = `
      select p.*, c.icon as categoryIcon, c.name as categoryName, c.id as categoryId, s.name as storeName from t_product as p
      join t_product_category as c on p.categoryId = c.id
      join t_store as s on p.storeId = s.id
      where
        s.communityId = :communityId and
        s.status = 'normal' and
        p.status = 'online' and
        <% if (query.categoryId) { %> p.categoryId = :categoryId <% } else { %> 1 = 1 <% } %> and
        <% if (query.keyword) { %> p.title like :keyword  <% } else { %> 1 = 1 <% } %>
      order by p.updatedAt desc
    `;
        sql = ejs.render(sql, ctx);
        let ret = await db_1.raw(sql, Object.assign({ communityId: communityId }, ctx.query, { keyword: `%${ctx.query.keyword}%` }));
        return routes_1.success(ret);
    }
    async item(ctx) {
        let id = ctx.params.id;
        let ret = await db_1.first(`
      select p.*, s.address as storeAddress, s.name as storeName from t_product as p
      join t_store as s on p.storeId = s.id
      where p.id = ?
      `, [id]);
        if (ctx.query.isMine) {
            let communityId = ctx.session.communityId;
            let userId = ctx.session.userId;
            if (!userId) {
                throw new Error('请先注册');
            }
            let store = await db_1.Table.Store.where({
                communityId: communityId,
                userId: userId,
            }).first();
            if (store.id !== ret.storeId) {
                throw new Error('不可查看其他店铺的商品');
            }
        }
        return routes_1.success(ret);
    }
    async add(ctx) {
        let store = await store_1.getStore(ctx);
        if (_.isNil(store) || store.status !== 'normal') {
            throw new routes_1.ResponseError('您现在还没有店铺, 或者您的店铺还没通过审核');
        }
        let model = await product_1.getProductModel(ctx);
        let product = utils_1.create(models_1.Product, model);
        let wechat = await wechat_1.Wechat.create(ctx.session.communityId);
        let images = await product_1.savePhotos(model.serverIds, wechat);
        product.images = JSON.stringify(images);
        product.storeId = store.id;
        await db_1.Table.Product.insert(product);
        return routes_1.success();
    }
    async edit(ctx) {
        let store = await store_1.getStore(ctx);
        if (_.isNil(store) || store.status !== 'normal') {
            throw new routes_1.ResponseError('您现在还没有店铺, 或者您的店铺还没通过审核');
        }
        let model = await product_1.getProductModel(ctx);
        let product = await db_1.Table.Product.where('id', model.id).first();
        if (!product) {
            throw new routes_1.ResponseError('该产品不存在');
        }
        if (product.storeId !== store.id) {
            throw new routes_1.ResponseError('不可编辑其他店铺的商品');
        }
        await db_1.Table.Product.where('id', model.id).update({
            categoryId: model.categoryId,
            title: model.title,
            description: model.description,
            price: model.price,
            points: model.points,
            normalPrice: model.normalPrice,
        });
        return routes_1.success();
    }
    async offline(ctx) {
        let store = await store_1.getStore(ctx);
        if (_.isNil(store) || store.status !== 'normal') {
            throw new routes_1.ResponseError('您现在还没有店铺, 或者您的店铺还没通过审核');
        }
        let product = await db_1.Table.Product.where('id', ctx.params.id).first();
        if (!product) {
            throw new routes_1.ResponseError('该产品不存在');
        }
        if (product.storeId !== store.id) {
            throw new routes_1.ResponseError('不可编辑其他店铺的商品');
        }
        await db_1.Table.Product.where('id', ctx.params.id).update({
            status: 'offline',
        });
        return routes_1.success();
    }
    async online(ctx) {
        let store = await store_1.getStore(ctx);
        if (_.isNil(store) || store.status !== 'normal') {
            throw new routes_1.ResponseError('您现在还没有店铺, 或者您的店铺还没通过审核');
        }
        let product = await db_1.Table.Product.where('id', ctx.params.id).first();
        if (!product) {
            throw new routes_1.ResponseError('该产品不存在');
        }
        if (product.storeId !== store.id) {
            throw new routes_1.ResponseError('不可编辑其他店铺的商品');
        }
        await db_1.Table.Product.where('id', ctx.params.id).update({
            status: 'online',
        });
        return routes_1.success();
    }
};
__decorate([
    routes_1.get('/category'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "category", null);
__decorate([
    routes_1.get('/'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "list", null);
__decorate([
    routes_1.get('/item/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "item", null);
__decorate([
    routes_1.post('/add'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "add", null);
__decorate([
    routes_1.post('/edit'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "edit", null);
__decorate([
    routes_1.post('/offline/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "offline", null);
__decorate([
    routes_1.post('/online/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "online", null);
ProductController = __decorate([
    routes_1.router('/product')
], ProductController);
exports.ProductController = ProductController;
