import { Qrcode } from '../models';
export interface OrderProductConfirm {
    buyerId: string;
    productId: string;
}
export declare class QrcodeConfirm {
    orderProduct(qrcode: Qrcode, confirmerId: string): Promise<void>;
}
