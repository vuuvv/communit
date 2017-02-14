import * as yargs from  'yargs';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as session from 'koa-session';
import * as convert from 'koa-convert';
import * as cors from 'kcors';

import { error } from './routes';

const argv = yargs.argv;
const PORT = process.env.PORT || argv.port || 8383;
const HOST = process.env.HOST || argv.host || '0.0.0.0';

const app = new Koa();
const router = new Router();

/**
 * Error Handle middleware
 */
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    ctx.body = error(err.toString());
  }
});

/**
 * cors middleware
 */
app.use(cors({
  credentials: true,
}));

/**
 * session middleware
 */
app.keys = ['ksaklsidfoawejlafe'];

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 24 * 3600 * 1000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
};
app.use(convert(session(CONFIG, app)));


/**
 * router middleware
 */
app.use(router.routes());
app.use(router.allowedMethods());

import { WechatController } from './wechat';
import { SignupController } from './signup';
import { route } from './routes';
route(router, WechatController);
route(router, SignupController);

// console.log(router.stack);

app.listen(PORT, HOST);

console.log(`Listening at ${HOST}:${PORT}`);

