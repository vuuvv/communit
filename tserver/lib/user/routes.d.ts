import { Response } from '../routes';
export declare class UserController {
    carousel(ctx: any): Promise<Response>;
    me(ctx: any): Promise<Response>;
    hello(): Promise<string>;
    addAccount(ctx: any): Promise<Response>;
    deductAccount(): Promise<Response>;
    reverse(ctx: any): Promise<Response>;
}
