import { BaseModel } from './base_model';
import { property, uuid } from '../utils';

export enum QrCodeType {
  OrderProduct = 1,
}

const tips = {};

tips[QrCodeType.OrderProduct] = '向商家支付积分';

export class Qrcode extends BaseModel {
  @property()
  action: QrCodeType;
  @property()
  data: string;
  @property()
  tip: string;
  @property()
  status: string;
  @property()
  expiresIn: Date;

  constructor(action?: QrCodeType, data?: any) {
    super();
    this.action = action;
    this.status = 'submit';
    this.data = data ? JSON.stringify(data) : null;
    this.expiresIn = new Date(new Date().getTime() + 5 * 60 * 1000);
    this.tip = tips[this.action] || null;
  }
}

export const QrcodeTableName = 't_qrcode';
