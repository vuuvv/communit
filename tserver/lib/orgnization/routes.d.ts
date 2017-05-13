import { Response } from '../routes';
export declare class OrganizationController {
    type(ctx: any): Promise<Response>;
    home(ctx: any): Promise<Response>;
    item(ctx: any): Promise<Response>;
    users(ctx: any): Promise<Response>;
    joined(ctx: any): Promise<Response>;
    join(ctx: any): Promise<Response>;
    quit(ctx: any): Promise<Response>;
    addThread(ctx: any): Promise<Response>;
}
