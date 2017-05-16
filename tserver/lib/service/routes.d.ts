import { Response } from '../routes';
export declare class ServiceController {
    categories(ctx: any): Promise<Response>;
    category(ctx: any): Promise<Response>;
    /**
     * online=1     代表线上问答
     * online=0     代表非线上回答
     * online=其他   所有
     */
    types(ctx: any): Promise<Response>;
    list(ctx: any): Promise<Response>;
    listHelp(ctx: any): Promise<Response>;
    search(ctx: any): Promise<Response>;
    item(ctx: any): Promise<Response>;
    add(ctx: any): Promise<Response>;
    users(ctx: any): Promise<Response>;
    join(ctx: any): Promise<Response>;
    quit(ctx: any): Promise<Response>;
    reject(ctx: any): Promise<Response>;
    accept(ctx: any): Promise<Response>;
}
