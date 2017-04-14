import * as yargs from  'yargs';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as session from 'koa-session';
import * as convert from 'koa-convert';
import * as cors from 'kcors';
import * as views from 'koa-views';


import { error } from './routes';

const argv = yargs.argv;
const PORT = process.env.PORT || argv.port || 8383;
const HOST = process.env.HOST || argv.host || '0.0.0.0';

const app = new Koa();
const router = new Router();

/**
 * Error Handle middleware
 */
app.use(async (ctx: Koa.Context, next) => {
  try {
    console.log(`${ctx.method} ${ctx.path} ${ctx.request.ip}`);
    await next();
  } catch (err) {
    console.log(err);
    ctx.body = error(err);
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
 * views
 */

app.use(views(__dirname + '/views', { map: { html: 'ejs' } }));

/**
 * router middleware
 */
app.use(router.routes());
app.use(router.allowedMethods());

import { PageController } from './page';
import { WechatController } from './wechat';
import { SignupController } from './signup';
import { UserController } from './user';
import { ArticleController, ArticlesController } from './article';
import { StoreController } from './store';
import { ProductController } from './product';
import { MenuController } from './menu';
import { OrganizationController } from './orgnization';
import { ServiceController } from './service';
import { AccountController } from './account';
import { OrderController } from './order';
import { QrcodeController } from './qr';
import { ActivityController } from './activity';
import { ApiController } from './api';
import { CapchaController } from './capcha';

import { route } from './routes';

route(router, PageController);
route(router, WechatController);
route(router, SignupController);
route(router, UserController);
route(router, ArticleController);
route(router, ArticlesController);
route(router, StoreController);
route(router, ProductController);
route(router, MenuController);
route(router, OrganizationController);
route(router, ServiceController);
route(router, AccountController);
route(router, OrderController);
route(router, QrcodeController);
route(router, ActivityController);
route(router, ApiController);
route(router, CapchaController);

// console.log(router.stack);

app.listen(PORT, HOST);

console.log(`Listening at ${HOST}:${PORT}`);

