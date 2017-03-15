import { Qrcode } from '../models';
export interface OrderProductConfirm {
    buyerId: string;
    productId: string;
}
export interface OrderServiceConfirm {
    scanedId: string;
    serviceId: string;
}
export declare class QrcodeConfirm {
    orderProduct(qrcode: Qrcode, confirmerId: string): Promise<void>;
    orderService(qrcode: Qrcode, confirmerId: string, action: string): Promise<void>;
    orderHelp(qrcode: Qrcode, confirmerId: string): Promise<void>;
    orderCustom(qrcode: Qrcode, confirmerId: string): Promise<void>;
    orderPublic(qrcode: Qrcode, confirmerId: string): Promise<void>;
}
