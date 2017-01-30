const qs = require('querystring');

const request = require('request-promise');
const sha1 = require('sha1');
const getRawBody = require('raw-body');
const xml2js = require('xml2js');
const db = require('../db');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true, explicitArray: false}, function(err, json) {
      if (err) {
        reject(err);
      } else {
        resolve(json);
      }
    });
  })
}

async function getMessage(request) {
  let body = await getRawBody(request.req, {
    length: request.length,
    limit: '1mb',
    encoding: request.charset,
  })

  let result = await parseXML(body);
  return result.xml;
}

async function createUser(gongzhonghao, user) {
  await db.execute('insert into t_wechat_user (gongzhonghao_id,openid,nickname,sex,language,city,province,country,headimgurl,subscribe_time,remark,groupid,tagid_list) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
   [gongzhonghao, user.openid, user.nickname, user.sex, user.language, user.city, user.province, user.country, user.headimgurl, user.subscribe_time, user.remark, user.groupid, user.tagid_list]);
}

class Wechat {
  constructor(config) {
    Object.assign(this, config);
  }

  static async create(id) {
    let config = await db.first('select * from t_wechat_gongzhonghao where id=?', [id]);
    return new Wechat(config);
  }

  checkSignature(query) {
    const text = [this.token, query.nonce, query.timestamp].sort().join('');
    return sha1(text) === query.signature;
  }

  async updateToken(token) {
    if (!token) {
      return;
    }
    await db.execute(
      "update t_wechat_gongzhonghao set access_token=?, expires_in=? where id=?",
      [token.access_token, new Date().getTime() + token.expires_in * 1000, this.id]
    );
  }

  async fetchToken() {
    console.log('fetch token')
    let token = await request('https://api.weixin.qq.com/cgi-bin/token', {
      qs: {
        grant_type: 'client_credential',
        appid: this.appid,
        secret: this.appsecret,
      },
      json: true,
    })
    token.expires_in -= 5 * 60;
    await this.updateToken(token);
    Object.assign(this, token);
    return token.access_token;
  }

  async getToken() {
    if (!this.access_token) {
      return await this.fetchToken();
    }
    let now = new Date().getTime();
    console.log(this.expires_in, now);
    if (this.expires_in > now) {
      return this.access_token;
    }
    console.log('here');
    return await this.fetchToken();
  }

  async createMenu() {
    let token = await this.getToken();
    console.log(token);
    let ret = await request(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`, {
      body: {
        "button": [
          {
            "type": "view",
            "name": "进入众邻",
            "url": "http://weixin.vuuvv.com/entry/1"
          }
        ]
      }
    });
    return ret;
  }

  async getUserInfo(openid) {
    let token = await this.getToken();
    let user = await request('https://api.weixin.qq.com/cgi-bin/user/info', {
      qs: {
        access_token: this.access_token,
        openid: openid,
      },
      json: true,
    });
    return user;
  }

  async getUserAccessToken(code) {
    return await request('https://api.weixin.qq.com/sns/oauth2/access_token', {
      qs: {
        appid: this.appid,
        secret: this.appsecret,
        code: code,
        grant_type: 'authorization_code',
      },
      json: true,
    })
  }

  textMessage(data) {
    return `
<xml>
<ToUserName><![CDATA[${data.to}]]></ToUserName>
<FromUserName><![CDATA[${data.from}]]></FromUserName>
<CreateTime>${new Date().getTime()}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[${data.text}]]></Content>
</xml>
`;
  }

  imageMessage(data) {
    return `
<xml>
<ToUserName><![CDATA[${data.to}]]></ToUserName>
<FromUserName><![CDATA[${data.from}]]></FromUserName>
<CreateTime>${new Date().getTime()}</CreateTime>
<MsgType><![CDATA[image]]></MsgType>
<Image>
<MediaId><![CDATA[${data.mediaId}]]></MediaId>
</Image>
</xml>
`;
  }

  voiceMessage(data) {
    return `
<xml>
<ToUserName><![CDATA[${data.to}]]></ToUserName>
<FromUserName><![CDATA[${data.from}]]></FromUserName>
<CreateTime>${new Date().getTime()}</CreateTime>
<MsgType><![CDATA[voice]]></MsgType>
<Voice>
<MediaId><![CDATA[${data.mediaId}]]></MediaId>
</Voice>
</xml>
`;
  }

  videoMessage(data) {
    return `
<xml>
<ToUserName><![CDATA[${data.to}]]></ToUserName>
<FromUserName><![CDATA[${data.from}]]></FromUserName>
<CreateTime>${new Date().getTime()}</CreateTime>
<MsgType><![CDATA[video]]></MsgType>
<Video>
<MediaId><![CDATA[${data.mediaId}]]></MediaId>
<Title><![CDATA[${data.title}]]></Title>
<Description><![CDATA[${data.description}]]></Description>
</Video>
</xml>
`;
  }

  musicMessage(data) {
    return `
<xml>
<ToUserName><![CDATA[${data.to}]]></ToUserName>
<FromUserName><![CDATA[${data.from}]]></FromUserName>
<CreateTime>${new Date().getTime()}</CreateTime>
<MsgType><![CDATA[music]]></MsgType>
<Music>
<Title><![CDATA[${data.title}]]></Title>
<Description><![CDATA[${data.description}]]></Description>
<MusicUrl><![CDATA[${data.musicUrl}]]></MusicUrl>
<HQMusicUrl><![CDATA[${data.hdMusicUrl}]]></HQMusicUrl>
<ThumbMediaId><![CDATA[${data.mediaId}]]></ThumbMediaId>
</Music>
</xml>
`
  }

  newsMessage(data) {
    let items = [];
    for (let item of data.items) {
      items.push(`
<item>
<Title><![CDATA[${item.title}]]></Title>
<Description><![CDATA[${item.description}]]></Description>
<PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
<Url><![CDATA[${item.url}]]></Url>
</item>
`);
    }

    const itemXml = items.join('\n');

    return `
<xml>
<ToUserName><![CDATA[${data.to}]]></ToUserName>
<FromUserName><![CDATA[${data.from}]]></FromUserName>
<CreateTime>${new Date().getTime()}</CreateTime>
<MsgType><![CDATA[news]]></MsgType>
<ArticleCount>${data.items.length}</ArticleCount>
<Articles>
${itemXml}
</Articles>
</xml>
 `;
  }

  transferCustomerServiceMessage() {
    return `
<xml>
<ToUserName><![CDATA[${data.to}]]></ToUserName>
<FromUserName><![CDATA[${data.from}]]></FromUserName>
<CreateTime>${new Date().getTime()}</CreateTime>
<MsgType><![CDATA[transfer_customer_service]]></MsgType>
</xml>
`;
  }

  async dispatch(message) {
    console.log(message);
    if(message.MsgType === 'event') {
      let name = `on${capitalize(message.Event)}Event`;
      let ret = this[name].call(this, message);
      return ret || 'success';
    } else {
      let name = `on${capitalize(message.MsgType)}`;
      let ret = this[name].call(this, message);
      if (ret === false) {
        return transferCustomerServiceMessage();
      }
      return ret || 'success';
    }
  }

  async onText(message) {
    let user = await this.getUserInfo(message.FromUserName);
    console.log(user);
    return this.newsMessage({
      to: message.FromUserName,
      from: message.ToUserName,
      items: [
        {
          title: `您好, ${user.nickname}, 欢迎来到${this.name}`,
          description: message.Content,
          picUrl: user.headimgurl,
          url: 'http://central.huijinet.com/weixin/auth/login/redirect?url=/m3/',
        },
      ],
    });
  }

  async onImage(message) {
  }

  async onVoice(message) {
  }

  async onVideo(message) {
  }

  async onShortvideo(message) {
  }

  async onLocation(message) {
  }

  async onLink(message) {
  }

  async onSubscribeEvent(message) {
    let user = await this.getUserInfo(message.FromUserName);
    console.log(user);
    await createUser(this.id, user);
    return this.textMessage({
      to: message.FromUserName,
      from: message.ToUserName,
      text: '欢迎关注',
    });
  }

  async onUnsubscribeEvent(message) {
  }

  async onScanEvent(message) {
  }

  async onLocationEvent(message) {
  }

  async onClickEvent(message) {
  }

  async onViewEvent(message) {
  }
}

exports.Wechat = Wechat;

exports.middleware = async function (ctx) {
  const wechat = await Wechat.create(ctx.params.id);

  // check signature
  const valid = wechat.checkSignature(ctx.query);
  if (!valid) {
    ctx.status = 401;
    ctx.body = 'Invalid signature';
    return;
  }

  if (ctx.method == 'GET') {
    ctx.body = query.echostr;
  } else if (ctx.method == 'POST') {
    let message = await getMessage(ctx.request);
    ctx.body = await wechat.dispatch(message);
  }
}
