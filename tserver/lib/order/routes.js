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
const models_1 = require("../models");
let OrderController = class OrderController {
    async GenerateProductQrcode(ctx) {
        let product = await db_1.Table.Product.where('id', ctx.params.id).first();
        if (!product) {
            throw new Error('无效的产品');
        }
        let userId = ctx.session.userId;
        let communityId = ctx.session.communityId;
        let accounts = await db_1.Table.Account.where({ communityId, userId });
        let balance = _.sumBy(accounts, a => a.balance);
        if (balance < product.points) {
            throw new Error('您的积分不足');
        }
        let code = new models_1.Qrcode(models_1.QrCodeType.OrderProduct, product.id);
        await db_1.Table.Qrcode.insert(code);
        return routes_1.success(code.id);
    }
    async GetQrcode(ctx) {
        let qr = await db_1.Table.Qrcode.where('id', ctx.params.id).first();
        return routes_1.success(qr);
    }
};
__decorate([
    routes_1.post('/buy/:id/qr'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "GenerateProductQrcode", null);
__decorate([
    routes_1.get('/qr/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "GetQrcode", null);
OrderController = __decorate([
    routes_1.router('/order')
], OrderController);
exports.OrderController = OrderController;
