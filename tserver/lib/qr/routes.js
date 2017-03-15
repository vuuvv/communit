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
const models_1 = require("../models");
const wechat_1 = require("../wechat");
const config_1 = require("../config");
const qrcode_1 = require("./qrcode");
let QrcodeController = class QrcodeController {
    /**
     * 买家生成二维码
     * @param ctx
     */
    async BuyByQr(ctx) {
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
        let code = new models_1.Qrcode(communityId, models_1.QrcodeAction.OrderProduct, {
            buyerId: userId,
            productId: product.id,
        });
        await db_1.Table.Qrcode.insert(code);
        return routes_1.success(code.id);
    }
    async GenerateServiceQr(ctx) {
        let service = await db_1.Table.Service.where('id', ctx.params.id).first();
        if (!service) {
            throw new Error('无效的活动');
        }
        let userId = ctx.session.userId;
        let communityId = ctx.session.communityId;
        let action = models_1.QrcodeAction.OrderHelp;
        switch (service.categoryId) {
            case models_1.ServiceCategories.Help:
                action = models_1.QrcodeAction.OrderHelp;
                break;
            case models_1.ServiceCategories.Custom:
                action = models_1.QrcodeAction.OrderCustom;
                break;
            case models_1.ServiceCategories.Public:
                action = models_1.QrcodeAction.OrderPublic;
                break;
        }
        if (action !== models_1.QrcodeAction.OrderCustom) {
            let accounts = await db_1.Table.Account.where({ communityId, userId });
            let balance = _.sumBy(accounts, a => a.balance);
            if (balance < service.points) {
                throw new Error('您的积分不足');
            }
        }
        let code = new models_1.Qrcode(communityId, action, {
            scanedId: userId,
            serviceId: service.id,
        });
        await db_1.Table.Qrcode.insert(code);
        return routes_1.success(code.id);
    }
    /**
     * 扫描二维码后的跳转链接, 微信入口
     * @param ctx
     */
    async ScanQr(ctx) {
        let qr = await db_1.Table.Qrcode.where('id', ctx.params.id).first();
        let wechat = await wechat_1.Wechat.create(qr.communityId);
        let config = await config_1.Config.instance();
        let url = wechat.redirectUrl(config.hostUrl(`/qr/confirm/${ctx.params.id}`));
        ctx.redirect(url);
    }
    /**
     * 二维码的确认操作， 有扫描二维码的人员完成
     * @param ctx
     */
    async SellByQr(ctx) {
        let qrcode = await db_1.Table.Qrcode.where('id', ctx.params.id).first();
        if (!qrcode || new Date() > new Date(qrcode.expiresIn) || qrcode.status !== 'submit') {
            await utils_1.errorPage(ctx, '二维码已失效');
            return;
        }
        let wechat = await wechat_1.Wechat.create(qrcode.communityId);
        let user = await wechat.login(ctx);
        let confirm = new qrcode_1.QrcodeConfirm();
        try {
            let order = await confirm[qrcode.action](qrcode, user.userId);
            return routes_1.success(order);
        }
        catch (err) {
            await utils_1.errorPage(ctx, err.message);
        }
    }
    /**
     * 获取二维码信息
     */
    async GetQrcode(ctx) {
        let qr = await db_1.Table.Qrcode.where('id', ctx.params.id).first();
        return routes_1.success(qr);
    }
};
__decorate([
    routes_1.post('/g/product/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrcodeController.prototype, "BuyByQr", null);
__decorate([
    routes_1.post('/g/service/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrcodeController.prototype, "GenerateServiceQr", null);
__decorate([
    routes_1.get('/scan/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrcodeController.prototype, "ScanQr", null);
__decorate([
    routes_1.get('/confirm/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrcodeController.prototype, "SellByQr", null);
__decorate([
    routes_1.get('/get/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrcodeController.prototype, "GetQrcode", null);
QrcodeController = __decorate([
    routes_1.router('/qr')
], QrcodeController);
exports.QrcodeController = QrcodeController;
