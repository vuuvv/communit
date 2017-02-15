import * as knex from 'knex';
const config = require('../knexfile');
const env = 'development';


export const db = knex(config[env]);

/*
db.on('query', function(queryData) {
  console.log(queryData.sql);
  console.log(queryData.bindings);
});
*/

import {
  WechatOfficialAccount, WechatOfficialAccountTableName,
  WechatUser, WechatUserTableName,
  WechatLog, WechatLogTableName,
  User, UserTableName,
} from './models';

export interface Model<T> {
  new (): T;
}

export class Table<T> {
  type: Model<T>;
  tableName: string;

  constructor(type: Model<T>, tableName: string) {
    this.type = type;
    this.tableName = tableName;
  }

  get database() {
    return db(this.tableName);
  }

  static get WechatOfficialAccount() {
    return new Table<WechatOfficialAccount>(WechatOfficialAccount, WechatOfficialAccountTableName).database;
  }

  static get WechatUser() {
    return new Table<WechatUser>(WechatUser, WechatUserTableName).database;
  }

  static get WechatLog() {
    return new Table<WechatLog>(WechatLog, WechatLogTableName).database;
  }

  static get User() {
    return new Table<User>(User, UserTableName).database;
  }
}
