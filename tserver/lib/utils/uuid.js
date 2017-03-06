"use strict";
const uuidv4 = require("uuid/v4");
function uuid() {
    return uuidv4().replace(/-/g, '');
}
exports.uuid = uuid;
