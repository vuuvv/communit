"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("./property"));
__export(require("./http"));
__export(require("./uuid"));
__export(require("./validators"));
const crypto = require("crypto");
function signature(secret, plan) {
    let h = crypto.createHmac('sha1', secret);
    h.update(plan);
    return h.digest('hex').toUpperCase();
}
exports.signature = signature;
function checkSignature(secret, plan, target) {
    if (!target) {
        return false;
    }
    return signature(secret, plan) === target.toUpperCase();
}
exports.checkSignature = checkSignature;
function isInteger(value) {
    return !isNaN(value) && parseInt(Number(value) + '', 10) == value && !isNaN(parseInt(value, 10));
}
exports.isInteger = isInteger;
function validPoints(points) {
    if (points == null) {
        throw new Error('积分必须为正整数');
    }
    if (typeof points !== 'string' && typeof points !== 'number') {
        throw new Error('积分必须为正整数');
    }
    if (!/^[+]?\d+$/.test(points.toString())) {
        throw new Error('积分必须为正整数');
    }
    let ret = +points;
    if (ret <= 0) {
        throw new Error('积分必须大于1');
    }
    return ret;
}
exports.validPoints = validPoints;
