import { BaseModel } from './base_model';
import { property } from '../utils';

export class ThreadRank extends BaseModel {
  /**
   * 主题贴Id
   */
  @property()
  threadId: string;
  /**
   * 社区Id
   */
  @property()
  communityId: string;
  /**
   * 用户Id
   */
  @property()
  userId: string;
  /**
   * 1代表赞，0代表踩
   */
  @property()
  rank: number;
}

export const ThreadRankTableName = 't_thread_rank';

