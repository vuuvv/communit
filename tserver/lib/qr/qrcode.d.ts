import { Qrcode, Order } from '../models';
export interface OrderProductConfirm {
    buyerId: string;
    order: Order;
}
export interface OrderServiceConfirm {
    buyerId: string;
    serviceId: string;
}
export declare class QrcodeConfirm {
    orderProduct(qrcode: Qrcode, confirmerId: string): Promise<string>;
    orderService(qrcode: Qrcode, confirmerId: string, action: string): Promise<string>;
    orderHelp(qrcode: Qrcode, confirmerId: string): Promise<string>;
    orderCustom(qrcode: Qrcode, confirmerId: string): Promise<string>;
    orderPublic(qrcode: Qrcode, confirmerId: string): Promise<string>;
}
