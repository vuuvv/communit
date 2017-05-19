import { BaseModel } from './base_model';
export declare class AnswerSession extends BaseModel {
    /**
     * 社区id
     */
    communityId: string;
    /**
     * 用户Id
     */
    userId: string;
    /**
     * 回答Id
     */
    answerId: string;
    /**
     * 回答类型
     * 'text': 文本类型
     * 'price': 出价类型, 可进行确认操作
     */
    type: string;
    /**
     * 对于text类型, 回答内容
     */
    content: string;
    /**
     * 对于price类型, 定价积分
     */
    points: number;
}
export declare const AnswerSessionTableName = "t_answer_session";
