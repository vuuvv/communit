import * as qs from 'querystring';
import * as xml2js from 'xml2js';
import * as sha1 from 'sha1';
import * as request from 'request-promise';
import { Request } from 'koa';

import { Table, db } from '../db';
import { WechatOfficialAccount, WechatUser, WechatLog } from '../models';

import { create, assign, getRawBody } from '../utils';

const SUCCESS_RESPONSE = 'success';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function parseXML(xml): Promise<any> {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true, explicitArray: false}, function(err, json) {
      if (err) {
        reject(err);
      } else {
        resolve(json);
      }
    });
  });
}

export declare interface Notify {
  ToUserName: string;
  FromUserName: string;
  CreateTime: string;
  MsgType: string;
}

export declare interface Message extends Notify {
  MsgID: string;
}

export declare interface Event extends Notify {
  Event: string;
}

export declare interface TextMessage extends Message {
  Content: string;
}

export declare interface ImageMessage extends Message {
  PicUrl: string;
  MediaId: string;
}

export declare interface VoiceMessage extends Message {
  MediaId: string;
  Format: string;
  Recognition?: string;
}

export declare interface VideoMessage extends Message {
  MediaId: string;
  ThumbMediaId: string;
}

export declare interface ShortVideoMessage extends Message {
  MediaId: string;
  ThumbMediaId: string;
}

export declare interface LocationMessage extends Message {
  Location_X: string;
  Location_Y: string;
  Scale: string;
  Label: string;
}

export declare interface LinkMessage extends Message {
  Title: string;
  Description: string;
  Url: string;
}

export declare interface SubscribeEvent extends Event {
  EventKey: string;
  Ticket: string;
}

export declare interface ScanEvent extends Event {
  EventKey: string;
  Ticket: string;
}

export declare interface LocationEvent extends Event {
  Latitude: string;
  Longitude: string;
  Precision: string;
}

export declare interface ClickEvent extends Event {
  EventKey: string;
}

export declare interface ViewEvent extends Event {
  EventKey: string;
}

export class Reply {
  ToUserName: string;
  FromUserName: string;
  CreateTime: string = (new Date().getTime() / 1000).toFixed(0);
  MsgType: string;

  constructor(from: string, to: string) {
    this.FromUserName = from;
    this.ToUserName = to;
  }

  toXml(): string {
    return '';
  }

  commonXml(): string {
    return `<ToUserName><![CDATA[${this.ToUserName}]]></ToUserName>
<FromUserName><![CDATA[${this.FromUserName}]]></FromUserName>
<CreateTime>${this.CreateTime}</CreateTime>
<MsgType><![CDATA[${this.MsgType}]]></MsgType>`;
  }
}

export class TextReply extends Reply {
  MsgType = 'text';
  Content: string;

  constructor(from: string, to: string, content: string) {
    super(from, to);
    this.Content = content;
  }

  toXml(): string {
    return `
<xml>
${this.commonXml()}
<Content><![CDATA[${this.Content}]]></Content>
</xml>
`;
  }
}

export class ImageReply extends Reply {
  MsgType = 'image';
  MediaId: string;

  constructor(from: string, to: string, mediaId: string) {
    super(from, to);
    this.MediaId = mediaId;
  }

  toXml(): string {
    return `
<xml>
${this.commonXml()}
<Image>
<MediaId><![CDATA[${this.MediaId}]]></MediaId>
</Image>
`;
  }
}

export class VoiceReply extends Reply {
  MsgType = 'voice';
  MediaId: string;

  constructor(from: string, to: string, mediaId: string) {
    super(from, to);
    this.MediaId = mediaId;
  }

  toXml(): string {
    return `
<xml>
${this.commonXml()}
<Voice>
<MediaId><![CDATA[${this.MediaId}]]></MediaId>
</Voice>
`;
  }
}

export class VideoReply extends Reply {
  MsgType = 'voice';
  MediaId: string;
  Title?: string;
  Description?: string;

  constructor(from: string, to: string, mediaId: string, title?: string, description?: string) {
    super(from, to);
    this.MediaId = mediaId;
    this.Title = title;
    this.Description = description;
  }

  toXml(): string {
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

export class MusicReply extends Reply {
  MsgType = 'music';
  ThumbMediaId: string;
  Title?: string;
  Description?: string;
  MusicURL?: string;
  HQMusicUrl?: string;

  constructor(from: string, to: string, mediaId: string, title?: string, description?: string, musicUrl?: string, hqMusicUrl?: string) {
    super(from, to);
    this.ThumbMediaId = mediaId;
    this.Title = title;
    this.Description = description;
    this.MusicURL = musicUrl;
    this.HQMusicUrl = hqMusicUrl;
  }

  toXml(): string {
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

export class Article {
  Title: string;
  Description: string;
  PicUrl: string;
  Url: string;
}

export class NewsReply extends Reply {
  MsgType = 'news';
  Articles: Article[];

  constructor(from: string, to: string, articles: Article[]) {
    super(from, to);
    this.Articles = articles;
  }

  toXml(): string {
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

export class TransferCustomerServiceReply extends Reply {
  MsgType = 'transfer_customer_service';

  toXml(): string {
    return `
<xml>
${this.commonXml()}
</xml>
`;
  }
}

export class Wechat {
  officialAccount: WechatOfficialAccount;

  static async create(id): Promise<Wechat> {
    const obj = await Table.WechatOfficialAccount.where('id', id).first();
    if (!obj) {
      return null;
    }
    return new Wechat(create(WechatOfficialAccount, obj));
  }

  constructor(officialAccount: WechatOfficialAccount) {
    this.officialAccount = officialAccount;
  }

  redirectUrl(url: string, state = '') {
    let account = this.officialAccount;
    return 'https://open.weixin.qq.com/connect/oauth2/authorize?' + qs.stringify({
      appid: account.appId,
      redirect_uri: url,
      response_type: 'code',
      scope: 'snsapi_base',
      state: state
    }) + '#wechat_redirect';
  }

  checkSignature(query: any) {
    const text = [this.officialAccount.token, query.nonce, query.timestamp].sort().join('');
    return sha1(text) === query.signature;
  }

  async updateToken(officialAccount: WechatOfficialAccount) {
    await Table.WechatOfficialAccount.where('id', officialAccount.id).update({
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

  async createUser(openid) {
    let user = await this.getUserInfo(openid);
    if (!user) {
      return null;
    }
    let ret = null;
    await db.transaction(async (trx) => {
      let wechatUser = await Table.WechatUser.transacting(trx).where({
        openId: openid,
        officialAccountId: this.officialAccount.id,
      }).forUpdate().first();
      if (!wechatUser) {
        wechatUser = create(WechatUser, user);
        wechatUser.officialAccountId = this.officialAccount.id;
        wechatUser.tagIdList = wechatUser.tagIdList.toString();
        await Table.WechatUser.transacting(trx).insert(wechatUser);
      }
      ret = wechatUser;
    });
    return ret;
  }

  async getUserAccessToken(code: string) {
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

  async getWechatUser(openid: string): Promise<WechatUser> {
    let ret = await Table.WechatUser.where({
      openid: openid,
      officialAccountId: this.officialAccount.id,
    }).first();

    if (ret) {
      return create<WechatUser>(WechatUser, ret);
    }

    return await this.createUser(openid);
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
    const body = await getRawBody(ctx);
    let result = await parseXML(body);
    let notify = <Event>result.xml;

    let log = new WechatLog();
    log.officialAccountId = this.officialAccount.id;
    log.request = body;
    log.type = notify.MsgType;
    log.event = notify.Event;
    log.from = notify.FromUserName;
    log.to = notify.ToUserName;

    const ids = await Table.WechatLog.insert(log).returning('id');

    let ret: any = SUCCESS_RESPONSE;
    if (notify.MsgType === 'event') {
      let fn = this[`on${capitalize(notify.Event)}Event`];
      ret = fn ? await fn.call(this, notify) : SUCCESS_RESPONSE;
    } else {
      let fn = this[`on${capitalize(notify.MsgType)}`];
      ret = fn ? await fn.call(this, notify) : SUCCESS_RESPONSE;
      if (ret === false) {
        ret = this.transferCustomerServiceMessage(notify);
      }
    }

    await Table.WechatLog.where('id', ids[0]).update('response', ret);

    return ret || SUCCESS_RESPONSE;
  }

  transferCustomerServiceMessage(notify: Notify) {
    let reply = new TransferCustomerServiceReply(notify.ToUserName, notify.FromUserName);
    return reply.toXml();
  }

  async onText(msg: TextMessage) {
    let reply = new TextReply(msg.ToUserName, msg.FromUserName, msg.Content);
    return reply.toXml();
  }

  async onSubscribeEvent(message: Event) {
    let user = this.createUser(message.FromUserName);

    return new TextReply(message.ToUserName, message.FromUserName, `谢谢关注${this.officialAccount.name}`).toXml();
  }
}

