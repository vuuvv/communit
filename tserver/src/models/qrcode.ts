import { BaseModel } from './base_model';
import { property, uuid } from '../utils';

export class QrcodeAction {
  static OrderProduct = 'orderProduct';
  static OrderHelp = 'orderHelp';
  static OrderCustom = 'orderCustom';
  static OrderPublic = 'orderPublic';
  static ActivityCheck = 'activityCheck';
  static OrderService = 'orderService';
}

const tips = {};

tips[QrcodeAction.OrderProduct] = '向商家支付积分';
tips[QrcodeAction.OrderHelp] = '向求助者收取积分';
tips[QrcodeAction.OrderCustom] = '向服务者支付积分';
tips[QrcodeAction.OrderPublic] = '向求助者收取积分';
tips[QrcodeAction.ActivityCheck] = '活动参与者扫码签到';
tips[QrcodeAction.OrderService] = '服务支付或收取积分';


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
