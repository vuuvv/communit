import * as knex from 'knex';
export declare const db: knex;
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
}