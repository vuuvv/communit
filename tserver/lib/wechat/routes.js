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
const qs = require("querystring");
const routes_1 = require("../routes");
const db_1 = require("../db");
const wechat_1 = require("./wechat");
const utils_1 = require("../utils");
const models_1 = require("../models");
const config_1 = require("../config");
const HOST = 'http://192.168.1.19:4200';
let WechatController = class WechatController {
    async getWechat(id) {
        let dbRet = await db_1.Table.WechatOfficialAccount.where('id', id).first();
        return utils_1.create(models_1.WechatOfficialAccount, dbRet);
    }
    async test(ctx) {
        const id = ctx.params.id;
        const wechat = await this.getWechat(id);
        const config = await config_1.Config.instance();
        ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?' + qs.stringify({
            appid: wechat.appId,
            redirect_uri: `${config.site.host}/${id}/login`,
            response_type: 'code',
            scope: 'snsapi_base',
            state: '123'
        }) + '#wechat_redirect');
    }
    async login(ctx) {
        const id = ctx.params.id;
        const code = ctx.query.code;
        const wechat = await wechat_1.Wechat.create(id);
        const token = await wechat.getUserAccessToken(code);
        if (!token.openid) {
            console.error(token);
            throw new routes_1.ResponseError('获取用户token失败');
        }
        let wechatUser = await wechat.getWechatUser(token.openid);
        if (!wechatUser) {
            throw new routes_1.ResponseError(`公众号${wechat.officialAccount.name}无此微信用户: ${token.openid}`);
        }
        ctx.session.wechatUserId = wechatUser.id;
        const config = await config_1.Config.instance();
        if (!wechatUser.userId) {
            ctx.redirect(`${config.site.client}/#/user/verify`);
        }
        else {
            ctx.session.userId = wechatUser.userId;
            ctx.redirect(config.site.client);
        }
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
    async createMenu(ctx) {
        const id = ctx.params.id;
        const wechat = await wechat_1.Wechat.create(id);
        const ret = await wechat.createMenu({
            'button': [
                {
                    'type': 'view',
                    'name': '进入众邻',
                    'url': `http://weixin.vuuvv.com/wechat/${id}/entry`
                }
            ]
        });
        return routes_1.success(ret);
    }
    async url() {
        return await request('http://www.163.com');
    }
    redirect(ctx) {
        ctx.redirect('http://weixin.vuuvv.com/error');
    }
};
__decorate([
    routes_1.get('/:id/entry'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "test", null);
__decorate([
    routes_1.get('/:id/login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "login", null);
__decorate([
    routes_1.all('/:id/notify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "notify", null);
__decorate([
    routes_1.post('/:id/menu'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "createMenu", null);
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
