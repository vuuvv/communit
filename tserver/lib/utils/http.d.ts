import { Context } from 'koa';
export declare function getRawBody(ctx: Context): Promise<string>;
export declare function getJsonBody(ctx: Context): Promise<any>;
export declare function getNonceStr(): string;
export declare function getTimesTamp(): number;
export declare function errorPage(ctx: any, message: any): Promise<void>;
export declare function successPage(ctx: any, message: any, tip?: any): Promise<void>;
export declare function downloadImage(url: any): Promise<void>;
