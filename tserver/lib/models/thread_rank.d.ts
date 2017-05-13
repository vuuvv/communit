import { BaseModel } from './base_model';
export declare class ThreadRank extends BaseModel {
    /**
     * 主题贴Id
     */
    threadId: string;
    /**
     * 社区Id
     */
    communityId: string;
    /**
     * 用户Id
     */
    userId: string;
    /**
     * 1代表赞，0代表踩
     */
    rank: number;
}
export declare const ThreadRankTableName = "t_thread_rank";
