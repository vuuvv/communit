import { property } from '../utils';
import { BaseModel } from './base_model';


export class WechatOfficialAccount extends BaseModel {
  @property()
  name: string;
  @property('appid')
  appId: string;
  @property('appsecret')
  appSecret: string;
  @property()
  token: string;
  @property('access_token')
  accessToken: string;
  @property('expires_in')
  expiresIn: number;
}

export const WechatOfficialAccountTableName = 't_wechat_official_account';
