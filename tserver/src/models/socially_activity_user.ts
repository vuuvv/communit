import { BaseModel } from './base_model';
import { property } from '../utils';

export class SociallyActivityUser extends BaseModel {
  /**
   * 活动Id
   */
  @property()
  activityId: string;

  /**
   * 用户Id
   */
  @property()
  userId: string;

  /**
   * 社区Id
   */
  @property()
  communityId: string;

  /**
   * 状态, 用户状态, 'submit'报名, 'joined'审核通过, 'checked'已签到, 'reject' 报名未通过
   */
  @property()
  status: string;

  constructor() {
    super();
    this.status = 'submit';
  }

}

export const SociallyActivityUserTableName = 't_socially_activity_user';
