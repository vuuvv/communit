import { BaseModel } from './base_model';
export declare class QrcodeAction {
    static OrderProduct: string;
}
export declare class Qrcode extends BaseModel {
    communityId: string;
    action: string;
    data: string;
    tip: string;
    status: string;
    expiresIn: Date;
    constructor(communityId?: string, action?: string, data?: any);
}
export declare const QrcodeTableName = "t_qrcode";
