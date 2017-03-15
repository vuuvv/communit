export declare class AccountType {
    static Normal: string;
    static Buy: string;
}
export declare class TransactionType {
    static PayProduct: string;
    static GetProduct: string;
    static PayService: string;
    static GetService: string;
}
export declare function reverseTransaction(trx: any, transactionId: string): Promise<void>;
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
export declare function addPoints(trx: any, communityId: any, userId: any, accountTypeId: any, transactionTypeId: any, points: any, expiresIn?: number): Promise<string>;
export declare function deductPoints(trx: any, communityId: any, userId: any, transactionTypeId: any, points: any): Promise<any>;
