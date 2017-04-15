"use strict";
const yargs = require("yargs");
const Koa = require("koa");
const Router = require("koa-router");
const session = require("koa-session");
const convert = require("koa-convert");
const cors = require("kcors");
const views = require("koa-views");
const server = require("koa-static");
const path = require("path");
const routes_1 = require("./routes");
const argv = yargs.argv;
const PORT = process.env.PORT || argv.port || 8383;
const HOST = process.env.HOST || argv.host || '0.0.0.0';
const app = new Koa();
const router = new Router();
/**
 * Static Server
 */
app.use(server(path.join(__dirname, '..', 'static')));
/**
 * Error Handle middleware
 */
app.use(async (ctx, next) => {
    try {
        console.log(`${ctx.method} ${ctx.path} ${ctx.request.ip}`);
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
 * views
 */
app.use(views(__dirname + '/views', { map: { html: 'ejs' } }));
/**
 * router middleware
 */
app.use(router.routes());
app.use(router.allowedMethods());
const page_1 = require("./page");
const wechat_1 = require("./wechat");
const signup_1 = require("./signup");
const user_1 = require("./user");
const article_1 = require("./article");
const store_1 = require("./store");
const product_1 = require("./product");
const menu_1 = require("./menu");
const orgnization_1 = require("./orgnization");
const service_1 = require("./service");
const account_1 = require("./account");
const order_1 = require("./order");
const qr_1 = require("./qr");
const activity_1 = require("./activity");
const api_1 = require("./api");
const capcha_1 = require("./capcha");
const routes_2 = require("./routes");
routes_2.route(router, page_1.PageController);
routes_2.route(router, wechat_1.WechatController);
routes_2.route(router, signup_1.SignupController);
routes_2.route(router, user_1.UserController);
routes_2.route(router, article_1.ArticleController);
routes_2.route(router, article_1.ArticlesController);
routes_2.route(router, store_1.StoreController);
routes_2.route(router, product_1.ProductController);
routes_2.route(router, menu_1.MenuController);
routes_2.route(router, orgnization_1.OrganizationController);
routes_2.route(router, service_1.ServiceController);
routes_2.route(router, account_1.AccountController);
routes_2.route(router, order_1.OrderController);
routes_2.route(router, qr_1.QrcodeController);
routes_2.route(router, activity_1.ActivityController);
routes_2.route(router, api_1.ApiController);
routes_2.route(router, capcha_1.CapchaController);
// console.log(router.stack);
app.listen(PORT, HOST);
console.log(`Listening at ${HOST}:${PORT}`);
