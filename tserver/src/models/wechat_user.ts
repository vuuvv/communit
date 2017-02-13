import { property } from '../utils';
import { BaseModel } from './base_model';

export class WechatUser extends BaseModel {
  @property()
  officialAccountId: number;
  @property()
  userId?: number;
  @property('openid')
  openId: string;
  @property()
  nickname: string;
  @property()
  sex: boolean;
  @property()
  language: string;
  @property()
  city: string;
  @property()
  province: string;
  @property()
  country: string;
  @property()
  headimgurl: string;
  @property('subscribe_time')
  subscribeTime: string;
  @property('')
  remark: string;
  @property('groupid')
  groupId: string;
  @property('tagid_list')
  tagIdList: string;
  @property()
  latestActiveAt: string;
}

export const WechatUserTableName = 't_wechat_user';
