import * as knex from 'knex';
export declare const db: knex;
export declare function first(sql: string, params: any, trx?: any): Promise<any>;
export declare function raw(sql: string, params: any, trx?: any): Promise<any>;
export interface Model<T> {
    new (): T;
}
export declare class Table<T> {
    type: Model<T>;
    tableName: string;
    constructor(type: Model<T>, tableName: string);
    readonly database: knex.QueryBuilder;
    static readonly WechatOfficialAccount: knex.QueryBuilder;
    static readonly WechatUser: knex.QueryBuilder;
    static readonly WechatLog: knex.QueryBuilder;
    static readonly User: knex.QueryBuilder;
    static readonly Config: knex.QueryBuilder;
    static readonly Store: knex.QueryBuilder;
    static readonly Product: knex.QueryBuilder;
    static readonly ProductCategory: knex.QueryBuilder;
    static readonly BankMenu: knex.QueryBuilder;
    static readonly Organization: knex.QueryBuilder;
    static readonly OrganizationUser: knex.QueryBuilder;
    static readonly Service: knex.QueryBuilder;
    static readonly ServiceCategory: knex.QueryBuilder;
    static readonly ServiceType: knex.QueryBuilder;
    static readonly Account: knex.QueryBuilder;
    static readonly AccountDetail: knex.QueryBuilder;
    static readonly AccountType: knex.QueryBuilder;
    static readonly Transaction: knex.QueryBuilder;
    static readonly TransactionType: knex.QueryBuilder;
    static readonly TransactionDetail: knex.QueryBuilder;
}
