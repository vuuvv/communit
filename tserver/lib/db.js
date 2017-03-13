"use strict";
const knex = require("knex");
const config = require('../knexfile');
const env = 'development';
exports.db = knex(config[env]);
async function first(sql, params, trx = null) {
    let ret = await raw(sql, params, trx);
    if (ret) {
        return ret[0];
    }
    return null;
}
exports.first = first;
async function raw(sql, params, trx = null) {
    let ret = trx ? await trx.raw(sql, params) : await exports.db.raw(sql, params);
    if (ret && ret[0]) {
        return ret[0];
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
    static get Store() {
        return new Table(models_1.Store, models_1.StoreTableName).database;
    }
    static get Product() {
        return new Table(models_1.Product, models_1.ProductTableName).database;
    }
    static get ProductCategory() {
        return new Table(models_1.ProductCategory, models_1.ProductCategoryTableName).database;
    }
    static get BankMenu() {
        return new Table(models_1.BankMenu, models_1.BankMenuTableName).database;
    }
    static get Organization() {
        return new Table(models_1.Organization, models_1.OrganizationTableName).database;
    }
    static get OrganizationUser() {
        return new Table(models_1.OrganizationUser, models_1.OrganizationUserTableName).database;
    }
    static get Service() {
        return new Table(models_1.Service, models_1.ServiceTableName).database;
    }
    static get ServiceCategory() {
        return new Table(models_1.ServiceCategory, models_1.ServiceCategoryTableName).database;
    }
    static get ServiceType() {
        return new Table(models_1.ServiceType, models_1.ServiceTypeTableName).database;
    }
    static get Account() {
        return new Table(models_1.Account, models_1.AccountTableName).database;
    }
    static get AccountDetail() {
        return new Table(models_1.AccountDetail, models_1.AccountDetailTableName).database;
    }
    static get AccountType() {
        return new Table(models_1.AccountType, models_1.AccountTypeTableName).database;
    }
    static get Transaction() {
        return new Table(models_1.Transaction, models_1.TransactionTableName).database;
    }
    static get TransactionType() {
        return new Table(models_1.TransactionType, models_1.TransactionTypeTableName).database;
    }
    static get TransactionDetail() {
        return new Table(models_1.TransactionDetail, models_1.TransactionDetailTableName).database;
    }
    static get Qrcode() {
        return new Table(models_1.Qrcode, models_1.QrcodeTableName).database;
    }
}
exports.Table = Table;
