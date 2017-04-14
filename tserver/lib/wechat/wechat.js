"use strict";
const qs = require("querystring");
const xml2js = require("xml2js");
const sha1 = require("sha1");
const request = require("request-promise");
const db_1 = require("../db");
const models_1 = require("../models");
const utils_1 = require("../utils");
const SUCCESS_RESPONSE = 'success';
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function parseXML(xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, { trim: true, explicitArray: false }, function (err, json) {
            if (err) {
                reject(err);
            }
            else {
                resolve(json);
            }
        });
    });
}
class Reply {
    constructor(from, to) {
        this.CreateTime = (new Date().getTime() / 1000).toFixed(0);
        this.FromUserName = from;
        this.ToUserName = to;
    }
    toXml() {
        return '';
    }
    commonXml() {
        return `<ToUserName><![CDATA[${this.ToUserName}]]></ToUserName>
<FromUserName><![CDATA[${this.FromUserName}]]></FromUserName>
<CreateTime>${this.CreateTime}</CreateTime>
<MsgType><![CDATA[${this.MsgType}]]></MsgType>`;
    }
}
exports.Reply = Reply;
class TextReply extends Reply {
    constructor(from, to, content) {
        super(from, to);
        this.MsgType = 'text';
        this.Content = content;
    }
    toXml() {
        return `
<xml>
${this.commonXml()}
<Content><![CDATA[${this.Content}]]></Content>
</xml>
`;
    }
}
exports.TextReply = TextReply;
class ImageReply extends Reply {
    constructor(from, to, mediaId) {
        super(from, to);
        this.MsgType = 'image';
        this.MediaId = mediaId;
    }
    toXml() {
        return `
<xml>
${this.commonXml()}
<Image>
<MediaId><![CDATA[${this.MediaId}]]></MediaId>
</Image>
`;
    }
}
exports.ImageReply = ImageReply;
class VoiceReply extends Reply {
    constructor(from, to, mediaId) {
        super(from, to);
        this.MsgType = 'voice';
        this.MediaId = mediaId;
    }
    toXml() {
        return `
<xml>
${this.commonXml()}
<Voice>
<MediaId><![CDATA[${this.MediaId}]]></MediaId>
</Voice>
`;
    }
}
exports.VoiceReply = VoiceReply;
class VideoReply extends Reply {
    constructor(from, to, mediaId, title, description) {
        super(from, to);
        this.MsgType = 'voice';
        this.MediaId = mediaId;
        this.Title = title;
        this.Description = description;
    }
    toXml() {
        return `
<xml>
${this.commonXml()}
<Video>
<MediaId><![CDATA[${this.MediaId}]]></MediaId>
<Title><![CDATA[${this.Title}]]></Title>
<Description><![CDATA[${this.Description}]]></Description>
</Video>
`;
    }
}
exports.VideoReply = VideoReply;
class MusicReply extends Reply {
    constructor(from, to, mediaId, title, description, musicUrl, hqMusicUrl) {
        super(from, to);
        this.MsgType = 'music';
        this.ThumbMediaId = mediaId;
        this.Title = title;
        this.Description = description;
        this.MusicURL = musicUrl;
        this.HQMusicUrl = hqMusicUrl;
    }
    toXml() {
        return `
<xml>
${this.commonXml()}
<Music>
<Title><![CDATA[${this.Title}]]></Title>
<Description><![CDATA[${this.Description}]]></Description>
<MusicUrl><![CDATA[${this.MusicURL}]]></MusicUrl>
<HQMusicUrl><![CDATA[${this.HQMusicUrl}]]></HQMusicUrl>
<ThumbMediaId><![CDATA[${this.ThumbMediaId}]]></ThumbMediaId>
</Music>
`;
    }
}
exports.MusicReply = MusicReply;
class Article {
}
exports.Article = Article;
class NewsReply extends Reply {
    constructor(from, to, articles) {
        super(from, to);
        this.MsgType = 'news';
        this.Articles = articles;
    }
    toXml() {
        if (!this.Articles || !this.Articles.length) {
            console.error('NewsReply should have one article at least');
            return '';
        }
        let items = [];
        for (let item of this.Articles) {
            items.push(`
<item>
<Title><![CDATA[${item.Title}]]></Title>
<Description><![CDATA[${item.Description}]]></Description>
<PicUrl><![CDATA[${item.PicUrl}]]></PicUrl>
<Url><![CDATA[${item.Url}]]></Url>
</item>
`);
        }
        const itemXml = items.join('\n');
        return `
<xml>
${this.commonXml()}
<ArticleCount>${this.Articles.length}</ArticleCount>
<Articles>
${itemXml}
</Articles>
</xml>
 `;
    }
}
exports.NewsReply = NewsReply;
class TransferCustomerServiceReply extends Reply {
    constructor() {
        super(...arguments);
        this.MsgType = 'transfer_customer_service';
    }
    toXml() {
        return `
<xml>
${this.commonXml()}
</xml>
`;
    }
}
exports.TransferCustomerServiceReply = TransferCustomerServiceReply;
class Wechat {
    static async create(id) {
        const obj = await db_1.Table.WechatOfficialAccount.where('id', id).first();
        if (!obj) {
            return null;
        }
        return new Wechat(utils_1.create(models_1.WechatOfficialAccount, obj));
    }
    constructor(officialAccount) {
        this.officialAccount = officialAccount;
    }
    redirectUrl(url, state = '') {
        let account = this.officialAccount;
        return 'https://open.weixin.qq.com/connect/oauth2/authorize?' + qs.stringify({
            appid: account.appId,
            redirect_uri: url,
            response_type: 'code',
            scope: 'snsapi_base',
            state: state
        }) + '#wechat_redirect';
    }
    checkSignature(query) {
        const text = [this.officialAccount.token, query.nonce, query.timestamp].sort().join('');
        return sha1(text) === query.signature;
    }
    async updateToken(officialAccount) {
        await db_1.Table.WechatOfficialAccount.where('id', officialAccount.id).update({
            accountaccesstoken: officialAccount.accessToken,
            ADDTOEKNTIME: officialAccount.expiresIn,
        });
    }
    async fetchToken() {
        console.log('fetch token');
        const officialAccount = this.officialAccount;
        let token = await request('https://api.weixin.qq.com/cgi-bin/token', {
            qs: {
                grant_type: 'client_credential',
                appid: officialAccount.appId,
                secret: officialAccount.appSecret,
            },
            json: true,
        });
        if (token.error && token.errcode !== 0) {
            throw new Error(`[${token.errcode}]${token.errmsg}`);
        }
        token.expires_in -= 5 * 60;
        officialAccount.accessToken = token.access_token;
        officialAccount.expiresIn = new Date(new Date().getTime() + token.expires_in * 1000);
        await this.updateToken(officialAccount);
        return token.access_token;
    }
    async getToken() {
        const officialAccount = this.officialAccount;
        if (!officialAccount.accessToken) {
            return await this.fetchToken();
        }
        let now = new Date().getTime();
        if (officialAccount.expiresIn.getTime() > now) {
            return officialAccount.accessToken;
        }
        return await this.fetchToken();
    }
    async fetchJsApiToken() {
        const officialAccount = this.officialAccount;
        let token = await this.getToken();
        let resp = await request('https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
            qs: {
                access_token: token,
                type: 'jsapi',
            },
            json: true,
        });
        if (resp.errcode !== 0) {
            throw new Error(`[${resp.errcode}]${resp.errmsg}`);
        }
        officialAccount.jsapiticket = resp.ticket;
        officialAccount.jsapitickettime = new Date(new Date().getTime() + (resp.expires_in - 5 * 60) * 1000);
        await db_1.Table.WechatOfficialAccount.where('id', officialAccount.id).update({
            jsapiticket: officialAccount.jsapiticket,
            jsapitickettime: officialAccount.jsapitickettime,
        });
        return token.ticket;
    }
    async getJsApiToken() {
        const officialAccount = this.officialAccount;
        if (!officialAccount.jsapiticket) {
            return await this.fetchJsApiToken();
        }
        let now = new Date().getTime();
        if (officialAccount.jsapitickettime.getTime() > now) {
            return officialAccount.jsapiticket;
        }
        return await this.fetchJsApiToken();
    }
    async getUserInfo(openid) {
        let token = await this.getToken();
        let user = await request('https://api.weixin.qq.com/cgi-bin/user/info', {
            qs: {
                access_token: this.officialAccount.accessToken,
                openid: openid,
            },
            json: true,
        });
        if (user.errcode) {
            console.log(user);
            return null;
        }
        return user;
    }
    async getMedia(mediaId) {
        let token = await this.getToken();
        let media = await request('https://api.weixin.qq.com/cgi-bin/media/get', {
            qs: {
                access_token: this.officialAccount.accessToken,
                media_id: mediaId,
            },
            resolveWithFullResponse: true,
        });
        return media;
    }
    async saveMedia(mediaId, path) {
    }
    async createUser(openid) {
        let user = await this.getUserInfo(openid);
        if (!user) {
            return null;
        }
        let ret = null;
        await db_1.db.transaction(async (trx) => {
            let wechatUser = await db_1.Table.WechatUser.transacting(trx).where({
                openId: openid,
                officialAccountId: this.officialAccount.id,
            }).forUpdate().first();
            if (!wechatUser) {
                wechatUser = utils_1.create(models_1.WechatUser, user);
                wechatUser.officialAccountId = this.officialAccount.id;
                wechatUser.tagIdList = wechatUser.tagIdList.toString();
                await db_1.Table.WechatUser.transacting(trx).insert(wechatUser);
            }
            ret = wechatUser;
        });
        return ret;
    }
    async getUserAccessToken(code) {
        return await request('https://api.weixin.qq.com/sns/oauth2/access_token', {
            qs: {
                appid: this.officialAccount.appId,
                secret: this.officialAccount.appSecret,
                code: code,
                grant_type: 'authorization_code',
            },
            json: true,
        });
    }
    async getWechatUser(openid) {
        let ret = await db_1.Table.WechatUser.where({
            openid: openid,
            officialAccountId: this.officialAccount.id,
        }).first();
        if (ret) {
            return utils_1.create(models_1.WechatUser, ret);
        }
        return await this.createUser(openid);
    }
    async login(ctx) {
        const token = await this.getUserAccessToken(ctx.query.code);
        if (!token.openid) {
            console.error(token);
            throw new Error('获取用户token失败');
        }
        let wechatUser = await this.getWechatUser(token.openid);
        if (!wechatUser) {
            throw new Error(`公众号${this.officialAccount.name}无此微信用户: ${token.openid}`);
        }
        ctx.session.communityId = this.officialAccount.id;
        ctx.session.wechatUserId = wechatUser.id;
        return wechatUser;
    }
    async createMenu(menu) {
        let token = await this.getToken();
        let ret = await request({
            uri: `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`,
            method: 'POST',
            body: menu,
            json: true,
        });
        return ret;
    }
    async dispatch(ctx) {
        const body = await utils_1.getRawBody(ctx);
        let result = await parseXML(body);
        let notify = result.xml;
        let log = new models_1.WechatLog();
        log.officialAccountId = this.officialAccount.id;
        log.request = body;
        log.type = notify.MsgType;
        log.event = notify.Event;
        log.from = notify.FromUserName;
        log.to = notify.ToUserName;
        const ids = await db_1.Table.WechatLog.insert(log).returning('id');
        let ret = SUCCESS_RESPONSE;
        if (notify.MsgType === 'event') {
            let fn = this[`on${capitalize(notify.Event)}Event`];
            ret = fn ? await fn.call(this, notify) : SUCCESS_RESPONSE;
        }
        else {
            let fn = this[`on${capitalize(notify.MsgType)}`];
            ret = fn ? await fn.call(this, notify) : SUCCESS_RESPONSE;
            if (ret === false) {
                ret = this.transferCustomerServiceMessage(notify);
            }
        }
        await db_1.Table.WechatLog.where('id', ids[0]).update('response', ret);
        return ret || SUCCESS_RESPONSE;
    }
    transferCustomerServiceMessage(notify) {
        let reply = new TransferCustomerServiceReply(notify.ToUserName, notify.FromUserName);
        return reply.toXml();
    }
    async onText(msg) {
        let reply = new TextReply(msg.ToUserName, msg.FromUserName, msg.Content);
        return reply.toXml();
    }
    async onSubscribeEvent(message) {
        let user = this.createUser(message.FromUserName);
        return new TextReply(message.ToUserName, message.FromUserName, `谢谢关注${this.officialAccount.name}`).toXml();
    }
}
exports.Wechat = Wechat;
