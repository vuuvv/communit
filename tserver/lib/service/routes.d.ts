import { Response } from '../routes';
export declare class ServiceController {
    categories(ctx: any): Promise<Response>;
    category(ctx: any): Promise<Response>;
    types(ctx: any): Promise<Response>;
    list(ctx: any): Promise<void>;
    search(ctx: any): Promise<void>;
    add(ctx: any): Promise<Response>;
    join(ctx: any): Promise<Response>;
}
