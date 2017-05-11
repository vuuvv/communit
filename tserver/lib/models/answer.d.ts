import { BaseModel } from './base_model';
export declare class Answer extends BaseModel {
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
}
