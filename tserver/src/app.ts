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
    console.log(`${ctx.method} ${ctx.path}`);
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
 * router middleware
 */
app.use(router.routes());
app.use(router.allowedMethods());

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

import { route } from './routes';

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

// console.log(router.stack);

app.listen(PORT, HOST);

console.log(`Listening at ${HOST}:${PORT}`);

