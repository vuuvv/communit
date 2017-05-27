import { Order, Question } from '../models';
export declare class AccountType {
    static Normal: string;
    static Buy: string;
    static Store: string;
}
export declare class TransactionType {
    static PayProduct: string;
    static GetProduct: string;
    static PayService: string;
    static GetService: string;
    static PayHelper: string;
    static GetHelper: string;
    static PayAnswer: string;
    static GetAnswer: string;
    static PayCommunity: string;
    static PayActivity: string;
    static GetActivity: string;
    static RefundPayActivity: string;
    static RefundGetActivity: string;
}
export declare function getUserBalance(communityId: any, userId: any): Promise<number>;
export declare function reverseTransaction(trx: any, transactionId: string): Promise<any>;
/**
 * 增加积分
 * @param trx 事务对象
 * @param communityId 社区Id
 * @param userId 用户Id
 * @param accountTypeId 用户账户类型的Id
 * @param transactionTypeId 交易类型的Id
 * @param points 增加的积分数
 * @param expiresIn 有效期限(天)
 */
export declare function addPoints(trx: any, communityId: any, userId: any, accountTypeId: any, transactionTypeId: any, points: any, expiresIn?: number, orderId?: any): Promise<string>;
export declare function deductPoints(trx: any, communityId: any, userId: any, transactionTypeId: any, points: any, orderId?: any): Promise<any>;
export declare function refundOrder(trx: any, orderId: any): Promise<void>;
export declare function PayCommunity(trx: any, communityId: any, points: any): Promise<string>;
export declare function PayActivity(trx: any, activityUserId: any, points: any): Promise<string>;
export declare function RefundActivityUser(trx: any, activityUserId: string): Promise<string>;
export declare function ChangeActivityUser(trx: any, activityUserId: string, points: any): Promise<string>;
export declare function PayAnswer(trx: any, question: Question): Promise<Order>;
export declare function getAnswerPay(trx: any, answerId: any, points: any, currentUserId: any): Promise<void>;
export declare function payAnswer(trx: any, answerId: any, userId: any): Promise<void>;
export declare function confirmAnswerSession(trx: any, sessionId: any, currentUserId: any): Promise<Order>;
