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
const request = require("request-promise");
const routes_1 = require("../routes");
const db_1 = require("../db");
const wechat_1 = require("./wechat");
let WechatController = class WechatController {
    async test(ctx) {
        const id = ctx.params.id;
        const ret = db_1.Table.WechatOfficialAccount.first();
        return ret;
    }
    async notify(ctx) {
        const id = ctx.params.id;
        const wechat = await wechat_1.Wechat.create(id);
        const query = ctx.query;
        if (!wechat.checkSignature(query)) {
            ctx.status = 401;
            ctx.body = 'Invalid signature';
            return;
        }
        if (ctx.method === 'GET') {
            return query.echostr;
        }
        else if (ctx.method === 'POST') {
            return wechat.dispatch(ctx);
        }
    }
    async url() {
        return await request('http://www.taobao.com');
    }
    redirect(ctx) {
        ctx.redirect('http://weixin.vuuvv.com/error');
    }
};
__decorate([
    routes_1.get('/entry/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "test", null);
__decorate([
    routes_1.all('/notify/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "notify", null);
__decorate([
    routes_1.get('/url'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "url", null);
__decorate([
    routes_1.get('/redirect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WechatController.prototype, "redirect", null);
WechatController = __decorate([
    routes_1.router('/wechat')
], WechatController);
exports.WechatController = WechatController;
