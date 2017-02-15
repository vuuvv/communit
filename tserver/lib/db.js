"use strict";
const knex = require("knex");
const config = require('../knexfile');
const env = 'development';
exports.db = knex(config[env]);
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
}
exports.Table = Table;
