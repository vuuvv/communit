"use strict";
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
        return new Wechat(obj);
    }
    constructor(officialAccount) {
        this.officialAccount = officialAccount;
    }
    checkSignature(query) {
        const text = [this.officialAccount.token, query.nonce, query.timestamp].sort().join('');
        return sha1(text) === query.signature;
    }
    async updateToken(officialAccount) {
        await db_1.Table.WechatOfficialAccount.where('id', officialAccount.id).update({
            accessToken: officialAccount.accessToken,
            expiresIn: officialAccount.expiresIn,
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
        token.expires_in -= 5 * 60;
        officialAccount.accessToken = token.access_token;
        officialAccount.expiresIn = new Date().getTime() + token.expires_in * 1000;
        await this.updateToken(officialAccount);
        return token.access_token;
    }
    async getToken() {
        const officialAccount = this.officialAccount;
        if (!officialAccount.accessToken) {
            return await this.fetchToken();
        }
        let now = new Date().getTime();
        if (officialAccount.expiresIn > now) {
            return officialAccount.accessToken;
        }
        return await this.fetchToken();
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
        return user;
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
        let user = await this.getUserInfo(message.FromUserName);
        await db_1.db.transaction(async (trx) => {
            let wechatUser = await db_1.Table.WechatUser.transacting(trx).where({
                openId: message.FromUserName,
                officialAccountId: this.officialAccount.id,
            }).forUpdate().first();
            if (!wechatUser) {
                wechatUser = utils_1.create(models_1.WechatUser, user);
                wechatUser.officialAccountId = this.officialAccount.id;
                wechatUser.tagIdList = wechatUser.tagIdList.toString();
                await db_1.Table.WechatUser.transacting(trx).insert(wechatUser);
            }
        });
        return new TextReply(message.ToUserName, message.FromUserName, `谢谢关注${this.officialAccount.name}`).toXml();
    }
}
exports.Wechat = Wechat;
