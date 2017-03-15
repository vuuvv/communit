import { Response } from '../routes';
export declare class QrcodeController {
    /**
     * 买家生成二维码
     * @param ctx
     */
    BuyByQr(ctx: any): Promise<Response>;
    GenerateServiceQr(ctx: any): Promise<Response>;
    /**
     * 扫描二维码后的跳转链接, 微信入口
     * @param ctx
     */
    ScanQr(ctx: any): Promise<void>;
    /**
     * 二维码的确认操作， 有扫描二维码的人员完成
     * @param ctx
     */
    SellByQr(ctx: any): Promise<Response>;
    /**
     * 获取二维码信息
     */
    GetQrcode(ctx: any): Promise<Response>;
}
