import { Response } from '../routes';
export declare class AccountController {
    balance(ctx: any): Promise<Response>;
    summary(ctx: any): Promise<Response>;
    add(ctx: any): Promise<void>;
    edit(ctx: any): Promise<void>;
}
