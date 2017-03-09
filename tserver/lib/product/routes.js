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
const routes_1 = require("../routes");
const db_1 = require("../db");
const utils_1 = require("../utils");
const store_1 = require("../store");
const product_1 = require("./product");
const models_1 = require("../models");
let ProductController = class ProductController {
    async category(ctx) {
        let ret = await db_1.Table.ProductCategory.orderBy('sort');
        return routes_1.success(ret);
    }
    async list(ctx) {
        let ret = await db_1.raw(`
      select p.*, c.icon as categoryIcon, c.name as categoryName, c.id as categoryId from t_product as p
      join t_product_category as c on p.categoryId = c.id
      order by p.updatedAt desc
      `, []);
        return routes_1.success(ret);
    }
    async item(ctx) {
        let id = ctx.params.id;
        let ret = await db_1.first(`
      select p.*, s.address as storeAddress, s.name as storeName from t_product as p
      join t_store as s on p.storeId = s.id
      where p.id = ?
      `, [id]);
        return routes_1.success(ret);
    }
    async add(ctx) {
        let store = await store_1.getStore(ctx);
        if (_.isNil(store)) {
            throw new routes_1.ResponseError('您现在还没有店铺');
        }
        let model = await product_1.getProductModel(ctx);
        let product = utils_1.create(models_1.Product, model);
        product.storeId = store.id;
        await db_1.Table.Product.insert(product);
        return routes_1.success();
    }
};
__decorate([
    routes_1.get('/category'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "category", null);
__decorate([
    routes_1.get('/'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "list", null);
__decorate([
    routes_1.get('/item/:id'),
    routes_1.login,
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
ProductController = __decorate([
    routes_1.router('/product')
], ProductController);
exports.ProductController = ProductController;
