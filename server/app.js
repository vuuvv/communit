const Koa = require('koa');
const router = require('koa-router')();

const app = new Koa();

const wechat = require('./wechat');

app.use(router.routes()).use(router.allowedMethods());

router.all('/wechat/:id', wechat.middleware);

app.listen(8383);
