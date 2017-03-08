"use strict";
const knex = require("knex");
const config = require('../knexfile');
const env = 'development';
exports.db = knex(config[env]);
async function raw(sql, params) {
    let ret = await exports.db.raw(sql, params);
    if (ret && ret[0] && ret[0][0]) {
        return ret[0][0];
    }
    return null;
}
exports.raw = raw;
/*
db.on('query', function(queryData) {
  console.log(queryData.sql);
  console.log(queryData.bindings);
});
*/
const models_1 = require("./models");
class Table {
    constructor(type, tableName) {
        this.type = type;
        this.tableName = tableName;
    }
    get database() {
        return exports.db(this.tableName);
    }
    static get WechatOfficialAccount() {
        return new Table(models_1.WechatOfficialAccount, models_1.WechatOfficialAccountTableName).database;
    }
    static get WechatUser() {
        return new Table(models_1.WechatUser, models_1.WechatUserTableName).database;
    }
    static get WechatLog() {
        return new Table(models_1.WechatLog, models_1.WechatLogTableName).database;
    }
    static get User() {
        return new Table(models_1.User, models_1.UserTableName).database;
    }
    static get Config() {
        return new Table(models_1.Config, models_1.ConfigTableName).database;
    }
}
exports.Table = Table;
