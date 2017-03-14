"use strict";
const getRawBody_ = require("raw-body");
const config_1 = require("../config");
async function getRawBody(ctx) {
    const request = ctx.request;
    return await getRawBody_(request.req, {
        length: request.length,
        limit: 1024 * 1024,
        encoding: request.charset,
    });
}
exports.getRawBody = getRawBody;
async function getJsonBody(ctx) {
    let body = await getRawBody(ctx);
    return JSON.parse(body);
}
exports.getJsonBody = getJsonBody;
function getNonceStr() {
    return Math.random().toString(36).substr(2, 15);
}
exports.getNonceStr = getNonceStr;
function getTimesTamp() {
    return parseInt(new Date().getTime() / 1000 + '', 10);
}
exports.getTimesTamp = getTimesTamp;
async function errorPage(ctx, message) {
    let config = await config_1.Config.instance();
    await ctx.render('error', { message: '二维码已失效', home: config.clientUrl('/') });
}
exports.errorPage = errorPage;
