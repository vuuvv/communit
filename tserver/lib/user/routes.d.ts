import { Response } from '../routes';
export declare class UserController {
    carousel(ctx: any): Promise<Response>;
    logo(ctx: any): Promise<Response>;
    me(ctx: any): Promise<Response>;
    community(ctx: any): Promise<Response>;
    organizations(ctx: any): Promise<Response>;
    biotype(ctx: any): Promise<Response>;
    workers(ctx: any): Promise<Response>;
    hello(): Promise<string>;
    addAccount(ctx: any): Promise<Response>;
    deductAccount(): Promise<Response>;
    reverse(ctx: any): Promise<Response>;
    logout(ctx: any): Promise<void>;
    points(ctx: any): Promise<void>;
}
