"use strict";
const getRawBody_ = require("raw-body");
async function getRawBody(ctx) {
    const request = ctx.request;
    return await getRawBody_(request.req, {
        length: request.length,
        limit: 1024 * 1024,
        encoding: request.charset,
    });
}
exports.getRawBody = getRawBody;
