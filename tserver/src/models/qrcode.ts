import { BaseModel } from './base_model';
import { property, uuid } from '../utils';

export class QrcodeAction {
  static OrderProduct = 'orderProduct';
}

const tips = {};

tips[QrcodeAction.OrderProduct] = '向商家支付积分';

export class Qrcode extends BaseModel {
  @property()
  communityId: string;
  @property()
  action: string;
  @property()
  data: string;
  @property()
  tip: string;
  @property()
  status: string;
  @property()
  expiresIn: Date;

  constructor(communityId?: string, action?: string, data?: any) {
    super();
    this.communityId = communityId;
    this.action = action;
    this.status = 'submit';
    this.data = data ? JSON.stringify(data) : null;
    this.expiresIn = new Date(new Date().getTime() + 5 * 60 * 1000);
    this.tip = tips[this.action] || null;
  }
}

export const QrcodeTableName = 't_qrcode';
