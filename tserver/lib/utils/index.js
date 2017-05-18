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
