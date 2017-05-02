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
const rawRequest = require("request");
const sha1 = require("sha1");
const routes_1 = require("../routes");
const db_1 = require("../db");
const wechat_1 = require("./wechat");
const utils_1 = require("../utils");
const models_1 = require("../models");
const config_1 = require("../config");
let WechatController = class WechatController {
    async getWechat(id) {
        let dbRet = await db_1.Table.WechatOfficialAccount.where('id', id).first();
        if (!dbRet) {
            return dbRet;
        }
        return utils_1.create(models_1.WechatOfficialAccount, dbRet);
    }
    async test(ctx) {
        const id = ctx.params.id.trim();
        const wechat = await wechat_1.Wechat.create(id);
        if (!wechat) {
            await utils_1.errorPage(ctx, '无效的微信公众号');
            return;
        }
        const config = await config_1.Config.instance();
        ctx.session.communityId = id;
        delete ctx.session.userId;
        ctx.redirect(wechat.redirectUrl(`${config.site.host}/wechat/login`));
    }
    async redirect(ctx) {
        const id = ctx.params.id.trim();
        const wechat = await wechat_1.Wechat.create(id);
        if (!wechat) {
            await utils_1.errorPage(ctx, '无效的微信公众号');
            return;
        }
        const config = await config_1.Config.instance();
        ctx.session.communityId = id;
        ctx.session.wechatRedirectUrl = ctx.params[0];
        delete ctx.session.userId;
        ctx.redirect(wechat.redirectUrl(`${config.site.host}/wechat/login`));
    }
    async login(ctx) {
        const wechat = await wechat_1.Wechat.create(ctx.session.communityId);
        const wechatUser = await wechat.login(ctx);
        const config = await config_1.Config.instance();
        if (wechatUser.userId) {
            ctx.session.userId = wechatUser.userId;
        }
        let url = ctx.session.wechatRedirectUrl;
        if (url) {
            delete ctx.session.wechatRedirectUrl;
            ctx.redirect(`${config.site.client}/#${url}`);
        }
        else {
            ctx.redirect(config.site.client);
        }
        // if (!wechatUser.userId) {
        //   ctx.redirect(`${config.site.client}/#/user/verify`);
        // } else {
        //   ctx.session.userId = wechatUser.userId;
        //   ctx.redirect(config.site.client);
        // }
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
    async signature(ctx) {
        const id = ctx.session.communityId;
        const data = await utils_1.getJsonBody(ctx);
        const wechat = await wechat_1.Wechat.create(id);
        const account = wechat.officialAccount;
        let ticket = await wechat.getJsApiToken();
        let timestamp = utils_1.getTimesTamp();
        let nonceStr = utils_1.getNonceStr();
        let str = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${data.url}`;
        return routes_1.success({
            signature: sha1(str),
            appId: account.appId,
            timestamp,
            nonceStr,
        });
    }
    async url() {
        return await request('http://www.163.com');
    }
    async media(ctx) {
        const id = ctx.session.communityId;
        const wechat = await wechat_1.Wechat.create(id);
        let url = await wechat.saveMedia('4vJ9a4ADDnM7EVN4hXFTZ7qHrI5bvATEqXTq3FLRc5Ev6WH3h-ZgjNl35SOJ1Pkm');
        return routes_1.success(url);
    }
    async preview(ctx) {
        const id = ctx.params.communityId;
        const wechat = await wechat_1.Wechat.create(id);
        let ret = await wechat.getMedia(ctx.params.serverId);
        let media = await new Promise((resolve, reject) => {
            rawRequest({
                url: 'https://api.weixin.qq.com/cgi-bin/media/get',
                qs: {
                    access_token: wechat.officialAccount.accessToken,
                    media_id: ctx.params.serverId,
                },
            }).pipe(ctx.res);
        });
    }
};
__decorate([
    routes_1.get('/:id/entry'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "test", null);
__decorate([
    routes_1.get('/:id/r(.*)'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "redirect", null);
__decorate([
    routes_1.get('/login'),
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
    routes_1.post('/signature/jsapi'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "signature", null);
__decorate([
    routes_1.get('/url'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "url", null);
__decorate([
    routes_1.get('/media'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "media", null);
__decorate([
    routes_1.get('/preview/:communityId/:serverId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "preview", null);
WechatController = __decorate([
    routes_1.router('/wechat')
], WechatController);
exports.WechatController = WechatController;
