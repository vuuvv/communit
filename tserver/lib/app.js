"use strict";
const yargs = require("yargs");
const Koa = require("koa");
const Router = require("koa-router");
const session = require("koa-session");
const convert = require("koa-convert");
const cors = require("kcors");
const routes_1 = require("./routes");
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
    }
    catch (err) {
        console.log(err);
        ctx.body = routes_1.error(err);
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
    key: 'koa:sess',
    maxAge: 24 * 3600 * 1000,
    overwrite: true,
    httpOnly: true,
    signed: true,
};
app.use(convert(session(CONFIG, app)));
/**
 * router middleware
 */
app.use(router.routes());
app.use(router.allowedMethods());
const wechat_1 = require("./wechat");
const signup_1 = require("./signup");
const user_1 = require("./user");
const routes_2 = require("./routes");
routes_2.route(router, wechat_1.WechatController);
routes_2.route(router, signup_1.SignupController);
routes_2.route(router, user_1.UserController);
// console.log(router.stack);
app.listen(PORT, HOST);
console.log(`Listening at ${HOST}:${PORT}`);
