import { Response } from '../routes';
export declare class WechatController {
    private getWechat(id);
    test(ctx: any): Promise<void>;
    login(ctx: any): Promise<void>;
    notify(ctx: any): Promise<any>;
    createMenu(ctx: any): Promise<Response>;
    url(): Promise<any>;
    redirect(ctx: any): void;
}
