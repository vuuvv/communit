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
let ServiceController = class ServiceController {
    async categories(ctx) {
        let ret = await db_1.Table.ServiceCategory.orderBy('sort');
        return routes_1.success(ret);
    }
    async category(ctx) {
        let ret = await db_1.Table.ServiceCategory.where('id', ctx.params.id).first();
        return routes_1.success(ret);
    }
    async types(ctx) {
        let ret = await db_1.Table.ServiceType.where('categoryId', ctx.params.id).orderBy('sort');
        return routes_1.success(ret);
    }
    async list(ctx) {
    }
    async search(ctx) {
    }
    async add(ctx) {
        let model = await utils_1.getRawBody(ctx);
        let category = await db_1.Table.ServiceCategory.where('id', ctx.params.id);
        if (!category) {
            throw new routes_1.ResponseError('非法类型');
        }
        let service = new models_1.Service();
        service.categoryId = category.id;
        service.communityId = ctx.session.communityId;
        service.userId = ctx.session.userId;
        service.content = model;
        await db_1.Table.Service.insert(service);
        return routes_1.success();
    }
    async join(ctx) {
        return routes_1.success();
    }
};
__decorate([
    routes_1.get('/categories'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "categories", null);
__decorate([
    routes_1.get('/category/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "category", null);
__decorate([
    routes_1.get('/types/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "types", null);
__decorate([
    routes_1.get('/list'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "list", null);
__decorate([
    routes_1.get('/search'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "search", null);
__decorate([
    routes_1.post('/add/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "add", null);
__decorate([
    routes_1.get('/join/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "join", null);
ServiceController = __decorate([
    routes_1.router('/service')
], ServiceController);
exports.ServiceController = ServiceController;
