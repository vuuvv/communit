const qs = require('querystring');
const Koa = require('koa');
const router = require('koa-router')();
const cors = require('kcors');
const session = require('koa-session');
const convert = require('koa-convert');
const db = require('./db');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    console.log('first')
    await next();
    console.log('second')
  } catch(err) {
    ctx.body = {
      success: false,
      error_code: '10001',
      error_message: err.toString(),
    }
  }
})

app.use(cors({
  credentials: true,
}));

app.keys = ['some secret hurr'];

var CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
};

app.use(convert(session(CONFIG, app)));

const wechat = require('./wechat');

app.use(router.routes()).use(router.allowedMethods());

router.all('/wechat/:id', wechat.middleware);

router.get('/entry/:id', async (ctx) => {
  const w = await wechat.Wechat.create(ctx.params.id);
  ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?' + qs.stringify({
    appid: w.appid,
    redirect_uri: 'http://weixin.vuuvv.com/login',
    response_type: 'code',
    scope: 'snsapi_base',
    state: '123'
  }) + '#wechat_redirect');
})

router.get('/login', async (ctx) => {
  console.log(ctx.session.userid);
  const gid = 1;
  const w = await wechat.Wechat.create(gid);
  const token = await w.getUserAccessToken(ctx.query.code);
  const user = await db.first("select * from t_wechat_user where gongzhonghao_id=? and openid=?", [gid, token.openid])
  ctx.session.userid = user.id;
  ctx.redirect('http://192.168.1.29:4200');
})

router.get('/menu', async (ctx) => {
  const w = await wechat.Wechat.create(1);
  const r = await w.createMenu();
  ctx.body = r;
})


router.get('/me', async (ctx) => {
  const userid = ctx.session.userid;
  if (userid) {
    const user = await db.first("select * from t_wechat_user where id=?", [ctx.session.userid])
    if (user) {
      ctx.body = {
        success: true,
        user: user,
      };
    }
  } else {
    ctx.body = {
      "success": false,
      "error_code": "10004",
      "error_message": "用户未登录"
    }
  }
})

app.listen(8383);
