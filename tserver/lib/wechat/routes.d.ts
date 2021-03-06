import { Response } from '../routes';
export declare class WechatController {
    private getWechat(id);
    test(ctx: any): Promise<void>;
    redirect(ctx: any): Promise<void>;
    login(ctx: any): Promise<void>;
    notify(ctx: any): Promise<any>;
    createMenu(ctx: any): Promise<Response>;
    signature(ctx: any): Promise<Response>;
    url(): Promise<any>;
    media(ctx: any): Promise<Response>;
    preview(ctx: any): Promise<void>;
}
