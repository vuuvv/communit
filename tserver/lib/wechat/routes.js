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
        ctx.redirect(wechat.redirectUrl(`${config.site.host}/wechat/login`));
    }
    async login(ctx) {
        const wechat = await wechat_1.Wechat.create(ctx.session.communityId);
        const wechatUser = await wechat.login(ctx);
        const config = await config_1.Config.instance();
        if (wechatUser.userId) {
            ctx.session.userId = wechatUser.userId;
        }
        ctx.redirect(config.site.client);
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
        if (!id) {
            throw new routes_1.ResponseError('为获取社区信息，请退出后重新进入');
        }
        const data = await utils_1.getJsonBody(ctx);
        const wechat = await wechat_1.Wechat.create(id);
        const account = wechat.officialAccount;
        let ticket = account.jsapiticket;
        let expires = account.jsapitickettime;
        if (!ticket || !expires || new Date().getTime() > expires.getTime()) {
            let accessToken = await wechat.getToken();
            let token = await request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`, { json: true });
            if (token && !token.errcode) {
                await db_1.Table.WechatOfficialAccount.where('id', id).update({
                    jsapiticket: token.ticket,
                    jsapitickettime: new Date(new Date().getTime() + (token.expires_in - 300) * 1000),
                });
                ticket = token.ticket;
            }
            else {
                throw new routes_1.ResponseError('获取jsapi_token失败');
            }
        }
        let timestamp = utils_1.getTimesTamp();
        let nonceStr = utils_1.getNonceStr();
        let str = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${data.url}`;
        return {
            signature: sha1(str),
            appId: account.appId,
            timestamp,
            nonceStr,
        };
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
    routes_1.get('/redirect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WechatController.prototype, "redirect", null);
WechatController = __decorate([
    routes_1.router('/wechat')
], WechatController);
exports.WechatController = WechatController;
