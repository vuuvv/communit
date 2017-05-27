import { BaseModel } from './base_model';
export declare class Answer extends BaseModel {
    /**
     * 社区id
     */
    communityId: string;
    /**
     * 用户Id
     */
    userId: string;
    /**
     * 问题Id
     */
    questionId: string;
    /**
     * 回答内容
     */
    content: string;
    /**
     * 获得积分
     */
    points: string;
    /**
     * 状态
     */
    status: string;
    /**
     * 订单Id
     */
    orderId: string;
    /**
     * 商家备注
     */
    memo: string;
    /**
     * 商家备注时间
     */
    memoTime: Date;
    /**
     * 最后一条answer_session插入的时间
     */
    latestAnswerTime: Date;
}
export declare const AnswerTableName = "t_answer";
