import { Response } from '../routes';
export declare class ProductController {
    category(ctx: any): Promise<Response>;
    categoryChildren(ctx: any): Promise<Response>;
    list(ctx: any): Promise<Response>;
    item(ctx: any): Promise<Response>;
    add(ctx: any): Promise<Response>;
    edit(ctx: any): Promise<Response>;
    offline(ctx: any): Promise<Response>;
    online(ctx: any): Promise<Response>;
}
