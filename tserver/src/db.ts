import * as knex from 'knex';
const config = require('../knexfile');
const env = 'development';


export const db = knex(config[env]);

export async function first(sql: string, params: any, trx: any = null) {
  let ret = await raw(sql, params, trx);
  if (ret) {
    return ret[0];
  }
  return null;
}

export async function raw(sql: string, params: any, trx: any = null) {
  let ret = trx ? await trx.raw(sql, params) : await db.raw(sql, params);
  if (ret && ret[0]) {
    return ret[0];
  }
  return null;
}

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
  Config, ConfigTableName,
  Store, StoreTableName,
  Product, ProductTableName,
  ProductCategory, ProductCategoryTableName,
  BankMenu, BankMenuTableName,
  Organization, OrganizationTableName,
  OrganizationUser, OrganizationUserTableName,
  Service, ServiceTableName,
  ServiceCategory, ServiceCategoryTableName,
  ServiceType, ServiceTypeTableName,
  Account, AccountTableName,
  AccountType, AccountTypeTableName,
  AccountDetail, AccountDetailTableName,
  Transaction, TransactionTableName,
  TransactionType, TransactionTypeTableName,
  TransactionDetail, TransactionDetailTableName,
  Qrcode, QrcodeTableName,
  Order, OrderTableName,
  OrderDetail, OrderDetailTableName,
  Carousel, CarouselTableName,
  SociallyActivity, SociallyActivityTableName,
  SociallyActivityUser, SociallyActivityUserTableName,
  Apicall, ApicallTableName,
  ServiceUser, ServiceUserTableName,
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

  static get Config() {
    return new Table<Config>(Config, ConfigTableName).database;
  }

  static get Store() {
    return new Table<Store>(Store, StoreTableName).database;
  }

  static get Product() {
    return new Table<Product>(Product, ProductTableName).database;
  }

  static get ProductCategory() {
    return new Table<ProductCategory>(ProductCategory, ProductCategoryTableName).database;
  }

  static get BankMenu() {
    return new Table<BankMenu>(BankMenu, BankMenuTableName).database;
  }

  static get Organization() {
    return new Table<Organization>(Organization, OrganizationTableName).database;
  }

  static get OrganizationUser() {
    return new Table<OrganizationUser>(OrganizationUser, OrganizationUserTableName).database;
  }

  static get Service() {
    return new Table<Service>(Service, ServiceTableName).database;
  }

  static get ServiceCategory() {
    return new Table<ServiceCategory>(ServiceCategory, ServiceCategoryTableName).database;
  }

  static get ServiceType() {
    return new Table<ServiceType>(ServiceType, ServiceTypeTableName).database;
  }

  static get Account() {
    return new Table<Account>(Account, AccountTableName).database;
  }

  static get AccountDetail() {
    return new Table<AccountDetail>(AccountDetail, AccountDetailTableName).database;
  }

  static get AccountType() {
    return new Table<AccountType>(AccountType, AccountTypeTableName).database;
  }

  static get Transaction() {
    return new Table<Transaction>(Transaction, TransactionTableName).database;
  }

  static get TransactionType() {
    return new Table<TransactionType>(TransactionType, TransactionTypeTableName).database;
  }

  static get TransactionDetail() {
    return new Table<TransactionDetail>(TransactionDetail, TransactionDetailTableName).database;
  }

  static get Qrcode() {
    return new Table<Qrcode>(Qrcode, QrcodeTableName).database;
  }

  static get Order() {
    return new Table<Order>(Order, OrderTableName).database;
  }

  static get OrderDetail() {
    return new Table<OrderDetail>(OrderDetail, OrderDetailTableName).database;
  }

  static get Carousel() {
    return new Table<Carousel>(Carousel, CarouselTableName).database;
  }

  static get SociallyActivity() {
    return new Table<SociallyActivity>(SociallyActivity, SociallyActivityTableName).database;
  }

  static get SociallyActivityUser() {
    return new Table<SociallyActivityUser>(SociallyActivityUser, SociallyActivityUserTableName).database;
  }

  static get Apicall() {
    return new Table<Apicall>(Apicall, ApicallTableName).database;
  }

  static get ServiceUser() {
    return new Table<ServiceUser>(ServiceUser, ServiceUserTableName).database;
  }
}
