import { property } from '../utils';
import { BaseModel } from './base_model';

export class WechatLog extends BaseModel {
  @property()
  officialAccountId: number;
  @property()
  request: string;
  @property()
  responst: string;
  @property()
  type: string;
  @property()
  event: string;
  @property()
  from: string;
  @property()
  to: string;
}

export const WechatLogTableName = 't_wechat_log';
