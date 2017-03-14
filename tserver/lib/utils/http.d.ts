import { Context } from 'koa';
export declare function getRawBody(ctx: Context): Promise<string>;
export declare function getJsonBody(ctx: Context): Promise<any>;
export declare function getNonceStr(): string;
export declare function getTimesTamp(): number;
export declare function errorPage(ctx: any, message: any): Promise<void>;
