const qs = require('querystring');
const Koa = require('koa');
const serve = require('koa-static');
const router = require('koa-router')();
const cors = require('kcors');
const session = require('koa-session');
const convert = require('koa-convert');
const koaBody = require('koa-body')({ multipart: true });
const getRawBody = require('raw-body');

const db = require('./db');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch(err) {
    ctx.body = {
      success: false,
      error_code: '10001',
      error_message: err.toString(),
    }
  }
})

app.use(serve('.'));

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

const HOST = 'http://192.168.0.106:4200';

router.get('/login', async (ctx) => {
  const gid = 1;
  const w = await wechat.Wechat.create(gid);
  const token = await w.getUserAccessToken(ctx.query.code);
  if (!token.openid) {
    ctx.body = '错误，请重新进入';
    return;
  }
  const user = await db.first("select * from t_wechat_user where gongzhonghao_id=? and openid=?", [gid, token.openid]);
  ctx.session.wechat_userid = user.id;
  if (!user.userid) {
    ctx.redirect(`${HOST}/#/user/verify`)
  } else {
    ctx.session.userid = user.userid
    ctx.redirect(HOST);
  }
})

router.get('/menu', async (ctx) => {
  const w = await wechat.Wechat.create(1);
  const r = await w.createMenu();
  ctx.body = r;
})


router.get('/me', async (ctx) => {
  const userid = ctx.session.userid;
  if (userid) {
    const user = await db.first("select w.*, u.phone from t_user as u join t_wechat_user as w on u.id=w.userid where u.id=?", [userid])
    if (user) {
      ctx.body = {
        success: true,
        value: user,
      };
      return;
    }
  } else {
    ctx.body = {
      "success": false,
      "error_code": "10004",
      "error_message": "用户未登录"
    }
  }
})

router.post('/verify', async (ctx) => {
  const request = ctx.request;
  let body = await getRawBody(request.req, {
    length: request.length,
    limit: '1mb',
    encoding: request.charset,
  })
  const data = JSON.parse(body.toString());
  ctx.session.verify_tel = data.tel;
  ctx.body = {
    success: true,
    value: data
  }
})

router.get('/verify', async (ctx) => {
  ctx.body = {
    success: true,
    value: ctx.session.verify_tel,
  }
})

router.post('/signup', async (ctx) => {
  const tel = ctx.session.verify_tel;
  if (!tel) {
    ctx.body = {
      success: false,
      error_code: '10001',
      error_message: '还未验证手机',
    }
    return;
  }
  const request = ctx.request;
  let body = await getRawBody(request.req, {
    length: request.length,
    limit: '1mb',
    encoding: request.charset,
  })
  const user = JSON.parse(body.toString());
  const _db = db;

  try {
    await _db.execute('insert into t_user (phone, name, area, address) values (?, ?, ?, ?)', [tel, user.name, user.area, user.address]);
    const wechat_userid = ctx.session.wechat_userid;
    if (wechat_userid) {
      const ret = await _db.first('select id from t_user where phone=?', [tel]);
      console.log(ret);
      await _db.execute('update t_wechat_user set userid=? where id=?', [ret.id, wechat_userid]);
    }
  }
  catch(err) {
    console.log(err);
    await _db.execute('delete from t_user where phone=?', [tel]);
    ctx.body = {
      success: false,
      error_code: '10001',
      error_message: err,
    }
    return;
  }
  ctx.session.verify_tel = null;

  ctx.body = {
    success: true,
  }
})

router.get('/clear', async (ctx) => {
  ctx.session = null;
  ctx.body = 'ok';
})

router.get('/test', async (ctx) => {
  var a = {};
  var ret = await db.query("select * from world.city where id=?", a.abc);
  console.log(ret);
  await new Promise((resolve, reject) => {
    process.nextTick(() => {
      try {
        let a = c.d.e;
        resolve('');
      }
      catch(err) {
        reject('err');
      }
    })
  });
  ctx.body = 'ok';
})

app.listen(8383);
