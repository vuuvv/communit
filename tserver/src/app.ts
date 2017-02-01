import * as yargs from  'yargs';
import * as Koa from 'koa';
import * as Router from 'koa-router';

const argv = yargs.argv;
const PORT = process.env.PORT || argv.port || 8383;
const HOST = process.env.HOST || argv.host || '0.0.0.0';

const app = new Koa();
const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

import { WechatController, TestController } from './wechat';
import { route } from './routes';
route(router, WechatController);
route(router, TestController);

app.listen(PORT, HOST);

console.log(`Listening at ${HOST}:${PORT}`);

