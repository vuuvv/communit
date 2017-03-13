import { BaseModel } from './base_model';
export declare enum QrCodeType {
    OrderProduct = 1,
}
export declare class Qrcode extends BaseModel {
    action: QrCodeType;
    data: string;
    tip: string;
    status: string;
    expiresIn: Date;
    constructor(action?: QrCodeType, data?: any);
}
export declare const QrcodeTableName = "t_qrcode";
