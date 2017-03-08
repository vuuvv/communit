import { property } from '../utils';
import { BaseModel } from './base_model';


export class WechatOfficialAccount extends BaseModel {
  @property('accountname')
  name: string;
  @property('accountappid')
  appId: string;
  @property('accountappsecret')
  appSecret: string;
  @property('accounttoken')
  token: string;
  @property('accountaccesstoken')
  accessToken: string;
  @property('ADDTOEKNTIME')
  expiresIn: Date;
  @property()
  jsapiticket: string;
  @property()
  jsapitickettime: Date;
}

export const WechatOfficialAccountTableName = 'weixin_account';
