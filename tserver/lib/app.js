"use strict";
const yargs = require("yargs");
const Koa = require("koa");
const Router = require("koa-router");
const routes_1 = require("./routes");
const argv = yargs.argv;
const PORT = process.env.PORT || argv.port || 8383;
const HOST = process.env.HOST || argv.host || '0.0.0.0';
const app = new Koa();
const router = new Router();
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        console.log(err);
        ctx.body = routes_1.error(err.toString());
    }
});
app.use(router.routes());
app.use(router.allowedMethods());
const wechat_1 = require("./wechat");
const routes_2 = require("./routes");
routes_2.route(router, wechat_1.WechatController);
// console.log(router.stack);
app.listen(PORT, HOST);
console.log(`Listening at ${HOST}:${PORT}`);
