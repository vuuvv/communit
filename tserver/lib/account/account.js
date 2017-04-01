"use strict";
const _ = require("lodash");
const db_1 = require("../db");
const utils_1 = require("../utils");
const models_1 = require("../models");
async function getWechatUser(officialAccountId, userId) {
    return await db_1.Table.WechatUser.where({ officialAccountId, userId }).first();
}
class AccountType {
}
AccountType.Normal = 'c7892688f90948e28008f82dbbd7f648';
AccountType.Buy = 'ae9215d040204b05b6ac345462c13b33';
AccountType.Store = '8771f55f8b854dfaa951e75329894d49';
exports.AccountType = AccountType;
class TransactionType {
}
TransactionType.PayProduct = '04b80557548d4d6588bff877afe03c6d';
TransactionType.GetProduct = 'd94d01e8d6b4411f842bf4dc295c969d';
TransactionType.PayService = '88c09b4eefe345d59cba1cb55fcafe74';
TransactionType.GetService = '469e867fb97a4f998726880ada7608c8';
TransactionType.PayCommunity = '6f822ac9c88a4e13bf4eaacf1050dcac';
TransactionType.PayActivity = '20869530294748e2971f46b19d5da328';
TransactionType.GetActivity = '68c5a973a00c4f33a10b9ae9d60879fa';
TransactionType.RefundPayActivity = '4d6c9ff43fe1420dbca306a8287b175c';
TransactionType.RefundGetActivity = 'cda6e63b1bc0462cb22d859d47869c40';
exports.TransactionType = TransactionType;
const reverseTransactionTypes = {};
reverseTransactionTypes[TransactionType.PayActivity] = TransactionType.RefundPayActivity;
reverseTransactionTypes[TransactionType.GetActivity] = TransactionType.RefundGetActivity;
async function insertTransactionDetail(trx, accountDetail, points, transactionId) {
    let td = new models_1.TransactionDetail();
    td.communityId = accountDetail.communityId;
    td.userId = accountDetail.userId;
    td.transactionId = transactionId;
    td.accountDetailId = accountDetail.id;
    td.amount = points;
    td.remain = accountDetail.remain;
    await db_1.Table.TransactionDetail.transacting(trx).insert(td);
    return td;
}
async function insertTransaction(trx, account, transactionTypeId, points, id = null) {
    let accounts = await db_1.Table.Account.transacting(trx).where({
        communityId: account.communityId,
        userId: account.userId,
    }).select('balance');
    let details = await db_1.raw(`
    select at.id, at.name, ad.remain from t_account_detail as ad join t_account_type as at on ad.typeId = at.id
    where ad.communityId = ? and ad.userId = ? and ad.remain > 0
    `, [account.communityId, account.userId], trx);
    let t = new models_1.Transaction();
    t.communityId = account.communityId;
    t.userId = account.userId;
    t.typeId = transactionTypeId;
    t.amount = points;
    t.remain = _.sumBy(accounts, v => v.balance);
    t.remainDetail = JSON.stringify(details);
    if (id) {
        t.id = id;
    }
    await db_1.Table.Transaction.transacting(trx).insert(t);
    return t;
}
async function reverseTransactionDetail(trx, detail, tid) {
    let accountDetail = await db_1.Table.AccountDetail.transacting(trx).where('id', detail.accountDetailId).first();
    accountDetail.remain -= detail.amount;
    await db_1.Table.AccountDetail.transacting(trx).where('id', accountDetail.id).update({
        remain: accountDetail.remain
    });
    await insertTransactionDetail(trx, accountDetail, -detail.amount, tid);
    return [accountDetail.typeId, -detail.amount];
}
async function reverseTransaction(trx, transactionId) {
    let t = await db_1.Table.Transaction.transacting(trx).where('id', transactionId).forUpdate().first();
    if (!t) {
        throw new Error(`无效的交易号: ${transactionId}`);
    }
    if (t.reverseTransactionId) {
        throw new Error(`该交易已退， 不可再退`);
    }
    let accounts = await db_1.Table.Account.transacting(trx).where({
        communityId: t.communityId,
        userId: t.userId,
    }).forUpdate();
    let tid = utils_1.uuid();
    let dirtyAccounts = [];
    let details = await db_1.Table.TransactionDetail.transacting(trx).where('transactionId', transactionId);
    for (let detail of details) {
        let ret = await reverseTransactionDetail(trx, detail, tid);
        let account = _.find(accounts, a => a.typeId === ret[0]);
        dirtyAccounts.push(account);
        account.balance += ret[1];
    }
    for (let account of dirtyAccounts) {
        await db_1.Table.Account.transacting(trx).where('id', account.id).update({
            balance: account.balance
        });
    }
    let type = reverseTransactionTypes[t.typeId] || t.typeId;
    await insertTransaction(trx, accounts[0], type, -t.amount, tid);
    await db_1.Table.Transaction.transacting(trx).where('id', t.id).update({
        reverseTransactionId: tid
    });
    return tid;
}
exports.reverseTransaction = reverseTransaction;
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
async function addPoints(trx, communityId, userId, accountTypeId, transactionTypeId, points, expiresIn = 180) {
    let account = await db_1.Table.Account.transacting(trx).where({
        communityId: communityId,
        userId: userId,
        typeId: accountTypeId,
    }).forUpdate().first();
    let accountDetail = new models_1.AccountDetail();
    accountDetail.communityId = communityId;
    accountDetail.userId = userId;
    accountDetail.typeId = accountTypeId;
    accountDetail.total = points;
    accountDetail.remain = points;
    accountDetail.expiresIn = new Date(new Date().getTime() + expiresIn * 24 * 3600 * 1000);
    await db_1.Table.AccountDetail.transacting(trx).insert(accountDetail);
    if (!account) {
        account = new models_1.Account();
        account.communityId = communityId;
        account.userId = userId;
        account.typeId = accountTypeId;
        account.balance = points;
        await db_1.Table.Account.transacting(trx).insert(account);
    }
    else {
        account.balance += points;
        await db_1.Table.Account.transacting(trx).where({
            id: account.id
        }).update({
            balance: account.balance
        });
    }
    let t = await insertTransaction(trx, account, transactionTypeId, points);
    await insertTransactionDetail(trx, accountDetail, points, t.id);
    return t.id;
}
exports.addPoints = addPoints;
async function deductPoints(trx, communityId, userId, transactionTypeId, points) {
    let accounts = await db_1.Table.Account.transacting(trx).where({
        communityId: communityId,
        userId: userId,
    }).forUpdate();
    console.log(communityId, userId);
    if (!accounts || !accounts.length) {
        throw new Error('余额不足');
    }
    let details = await db_1.Table.AccountDetail.transacting(trx)
        .where('communityId', communityId)
        .where('userId', userId)
        .where('remain', '>', 0)
        .orderBy('expiresIn');
    if (!details || !details.length || _.sumBy(details, v => v.remain) < points) {
        throw new Error('余额不足');
    }
    let tid = utils_1.uuid();
    let detailMap = {};
    accounts.forEach((v) => {
        detailMap[v.typeId] = [v, 0];
    });
    // 更新子账户，和交易详情
    let remained = points;
    for (let detail of details) {
        if (remained === 0) {
            break;
        }
        let map = detailMap[detail.typeId];
        let currentDeduct = 0;
        if (detail.remain >= remained) {
            // 该子账户的余额足够扣
            currentDeduct = remained;
            detail.remain -= remained;
            remained = 0;
        }
        else {
            currentDeduct = detail.remain;
            remained -= detail.remain;
            detail.remain = 0;
        }
        await db_1.Table.AccountDetail.transacting(trx).where('id', detail.id).update('remain', detail.remain);
        await insertTransactionDetail(trx, detail, -currentDeduct, tid);
        map[1] -= currentDeduct;
    }
    // 更新账户
    for (let key of Object.keys(detailMap)) {
        let v = detailMap[key];
        if (v[1] === 0) {
            // 账户无需更新
            return;
        }
        let account = v[0];
        await db_1.Table.Account.transacting(trx).where('id', account.id).update('balance', account.balance + v[1]);
    }
    await insertTransaction(trx, accounts[0], transactionTypeId, -points, tid);
    return tid;
}
exports.deductPoints = deductPoints;
async function refundOrder(trx, orderId) {
    if (!orderId) {
        throw new Error('orderId为空');
    }
    let order = await db_1.Table.Order.transacting(trx).where('id', orderId).forUpdate().first();
    if (!order) {
        throw new Error(`无效的订单:${orderId}`);
    }
    if (order.status === models_1.OrderStatus.Refund) {
        throw new Error('订单已退款，不可重复退款');
    }
    order.buyerRefundTransactionId = await reverseTransaction(trx, order.buyerTradeTransactionId);
    order.sellerRefundTransactionId = await reverseTransaction(trx, order.sellerTradeTransactionId);
    await db_1.Table.Order.transacting(trx).where('id', orderId).update({
        status: models_1.OrderStatus.Refund,
        buyerRefundTransactionId: order.buyerRefundTransactionId,
        sellerRefundTransactionId: order.sellerRefundTransactionId,
    });
}
exports.refundOrder = refundOrder;
async function PayCommunity(trx, communityId, points) {
    if (!communityId) {
        throw new Error('communityId不能为空');
    }
    points = parseInt(points, 10);
    if (isNaN(points) || points < 0) {
        throw new Error('points需为整数，且不能为负数');
    }
    let tid = await addPoints(trx, communityId, communityId, AccountType.Normal, TransactionType.PayCommunity, points);
    return tid;
}
exports.PayCommunity = PayCommunity;
async function PayActivity(trx, activityUserId, points) {
    points = parseInt(points, 10);
    if (!activityUserId) {
        throw new Error('activityUserId不能为空');
    }
    points = parseInt(points, 10);
    if (isNaN(points) || points < 0) {
        throw new Error('points需为整数，且不能为负数');
    }
    let activityUser = await db_1.Table.SociallyActivityUser.transacting(trx).where('id', activityUserId).forUpdate().first();
    if (!activityUser) {
        throw new Error('无效的activityUserId');
    }
    let communityId = activityUser.communityId;
    let seller = await getWechatUser(communityId, activityUser.userId);
    if (activityUser.status === models_1.SociallyActivityUserStatus.Payed) {
        throw new Error(`用户[${seller.realname}]已从活动中获取到积分， 不可重复获取, orderid: ${activityUser.orderId}`);
    }
    let activity = await db_1.Table.SociallyActivity.where('id', activityUser.activityId).first();
    if (!activity) {
        throw new Error(`activityUserId关联的activity已失效, activityUserId: ${activityUserId}, acitivtyId: ${activityUser.activityId}`);
    }
    let order = new models_1.Order();
    order.type = models_1.OrderType.Activity;
    order.communityId = activityUser.communityId;
    order.sellerId = seller.userId;
    order.buyerId = communityId;
    order.orderTime = order.payTime = order.tradeTime = new Date();
    let detail = new models_1.OrderDetail();
    detail.orderId = order.id;
    detail.type = models_1.OrderType.Activity;
    detail.productId = activityUserId;
    let amount = order.amount = points;
    order.buyerTradeTransactionId = await deductPoints(trx, communityId, order.buyerId, TransactionType.PayActivity, amount);
    order.sellerTradeTransactionId = await addPoints(trx, communityId, order.sellerId, AccountType.Normal, TransactionType.GetActivity, amount);
    order.status = models_1.OrderStatus.Done;
    await db_1.Table.Order.transacting(trx).insert(order);
    detail.points = amount;
    detail.data = JSON.stringify({
        activity: activity,
        activityUser: activityUser,
    });
    await db_1.Table.OrderDetail.transacting(trx).insert(detail);
    await db_1.Table.SociallyActivityUser.transacting(trx).where('id', activityUser.id).update({
        orderId: order.id,
        points: points,
        status: models_1.SociallyActivityUserStatus.Payed,
    });
    return order.id;
}
exports.PayActivity = PayActivity;
async function RefundActivityUser(trx, activityUserId) {
    if (!activityUserId) {
        throw new Error('activityUserId不能为空');
    }
    let activityUser = await db_1.Table.SociallyActivityUser.transacting(trx).where('id', activityUserId).forUpdate().first();
    if (!activityUser) {
        throw new Error('无效的activityUserId');
    }
    if (activityUser.status !== models_1.SociallyActivityUserStatus.Payed) {
        throw new Error('活动积分还未发放，无法退款');
    }
    await refundOrder(trx, activityUser.orderId);
    await db_1.Table.SociallyActivityUser.transacting(trx).where('id', activityUserId).update({
        orderId: null,
        points: 0,
        status: models_1.SociallyActivityUserStatus.Refund,
    });
    return activityUser.orderId;
}
exports.RefundActivityUser = RefundActivityUser;
async function ChangeActivityUser(trx, activityUserId, points) {
    points = parseInt(points, 10);
    if (isNaN(points) || points < 0) {
        throw new Error('points需为整数，且不能为负数');
    }
    if (!activityUserId) {
        throw new Error('activityUserId不能为空');
    }
    let activityUser = await db_1.Table.SociallyActivityUser.transacting(trx).where('id', activityUserId).forUpdate().first();
    if (!activityUser) {
        throw new Error('无效的activityUserId');
    }
    if (activityUser.status === models_1.SociallyActivityUserStatus.Payed) {
        if (activityUser.points === points) {
            // 已发放而且数值相同，不需要操作
            return activityUser.orderId;
        }
        // 已发放但数值不同，要先退款，再发放
        await refundOrder(trx, activityUser.orderId);
        await db_1.Table.SociallyActivityUser.transacting(trx).where('id', activityUserId).update({
            orderId: null,
            points: 0,
            status: models_1.SociallyActivityUserStatus.Refund,
        });
    }
    return await PayActivity(trx, activityUserId, points);
}
exports.ChangeActivityUser = ChangeActivityUser;
