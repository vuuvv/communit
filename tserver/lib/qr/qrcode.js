"use strict";
const db_1 = require("../db");
const models_1 = require("../models");
const account_1 = require("../account");
async function getWechatUser(officialAccountId, userId) {
    return await db_1.Table.WechatUser.where({ officialAccountId, userId }).first();
}
class QrcodeConfirm {
    async orderProduct(qrcode, confirmerId) {
        let data = JSON.parse(qrcode.data);
        if (!data.buyerId || !data.order || !confirmerId) {
            throw new Error('错误的二维码');
        }
        let buyer = await getWechatUser(qrcode.communityId, data.buyerId);
        if (!buyer) {
            throw new Error('无效的买家');
        }
        let seller = await getWechatUser(qrcode.communityId, confirmerId);
        if (!seller) {
            throw new Error('无效的卖家');
        }
        let store = await db_1.Table.Store.where({
            communityId: qrcode.communityId,
            userId: confirmerId,
        }).first();
        if (!store) {
            throw new Error('您还没有店铺， 不可售卖该产品');
        }
        if (store.status !== 'normal') {
            throw new Error('您的店铺已关闭，不可售卖产品');
        }
        let details = await db_1.Table.OrderDetail.where('orderId', data.order.id);
        for (let detail of details) {
            let product = JSON.parse(detail.data);
            if (product.storeId !== store.id) {
                throw new Error('该产品不属于您的店铺，请确认二维码上的产品信息');
            }
        }
        let ret = '';
        await db_1.db.transaction(async (trx) => {
            let order = await db_1.Table.Order.transacting(trx).where('id', data.order.id).forUpdate().first();
            if (order.status !== 'payed') {
                throw new Error(`[${order.status}]订单状态已失效，不可进行线下结算`);
            }
            qrcode = await db_1.Table.Qrcode.transacting(trx).where('id', qrcode.id).first();
            if (!qrcode || new Date() > new Date(qrcode.expiresIn) || qrcode.status !== 'submit') {
                throw new Error('二维码已失效');
            }
            let products = await db_1.Table.Product.transacting(trx).whereIn('id', details.map((v) => v.productId));
            for (let product of products) {
                if (product.status !== 'online') {
                    throw new Error('产品已下线，不可售卖');
                }
            }
            // 把店铺和店铺所有人的账户分开, 售卖商品的时候是店铺的账户进行收款
            order.sellerTradeTransactionId = await account_1.addPoints(trx, qrcode.communityId, store.id, account_1.AccountType.Store, account_1.TransactionType.GetProduct, order.amount, undefined, order.id);
            order.status = models_1.OrderStatus.Done;
            order.tradeTime = new Date();
            await db_1.Table.Order.transacting(trx).where('id', order.id).update({
                sellerTradeTransactionId: order.sellerTradeTransactionId,
                status: order.status,
                tradeTime: order.tradeTime,
            });
            await db_1.Table.Qrcode.transacting(trx).where('id', qrcode.id).update({
                status: 'done',
            });
            let titles = products.map((p) => p.title).join(',');
            ret = `${titles} 交易金额: ${order.amount}积分`;
        });
        return ret;
    }
    async orderService(qrcode, confirmerId, action) {
        let data = JSON.parse(qrcode.data);
        if (!data.buyerId || !data.order || !confirmerId) {
            throw new Error('错误的二维码');
        }
        let buyer = await getWechatUser(qrcode.communityId, data.order.buyerId);
        if (!buyer) {
            throw new Error('无效的买家');
        }
        let seller = await getWechatUser(qrcode.communityId, data.order.sellerId);
        if (!seller) {
            throw new Error('无效的卖家');
        }
        let detail = await db_1.Table.OrderDetail.where('orderId', data.order.id).first();
        let service = JSON.parse(detail.data);
        if (service.userId !== confirmerId) {
            throw new Error('该服务不属于你， 不可操作');
        }
        let serviceContent = JSON.parse(service.content);
        let ret = '';
        await db_1.db.transaction(async (trx) => {
            let order = await db_1.Table.Order.transacting(trx).where('id', data.order.id).forUpdate().first();
            if (order.status !== 'payed' || order.sellerTradeTransactionId) {
                throw new Error(`[${order.status}]订单状态已失效，不可进行线下结算`);
            }
            let user = await db_1.Table.ServiceUser.transacting(trx).where('id', detail.productId).first();
            if (user.status !== 'accept') {
                throw new Error('用户的参与状态错误, 禁止该操作');
            }
            qrcode = await db_1.Table.Qrcode.transacting(trx).where('id', qrcode.id).first();
            if (!qrcode || new Date() > new Date(qrcode.expiresIn) || qrcode.status !== 'submit') {
                throw new Error('二维码已失效');
            }
            order.sellerTradeTransactionId = await account_1.addPoints(trx, qrcode.communityId, order.sellerId, account_1.AccountType.Normal, account_1.TransactionType.GetService, order.amount, undefined, order.id);
            order.status = models_1.OrderStatus.Done;
            order.tradeTime = new Date();
            await db_1.Table.Order.transacting(trx).where('id', order.id).update({
                sellerTradeTransactionId: order.sellerTradeTransactionId,
                status: order.status,
                tradeTime: order.tradeTime,
            });
            await db_1.Table.ServiceUser.transacting(trx).where('id', detail.productId).update({
                status: 'done',
            });
            await db_1.Table.Qrcode.transacting(trx).where('id', qrcode.id).update({
                status: 'done',
            });
            ret = `${serviceContent.content} 交易金额: ${order.amount}积分`;
        });
        return ret;
    }
    async orderHelp(qrcode, confirmerId) {
        return await this.orderService(qrcode, confirmerId, models_1.QrcodeAction.OrderHelp);
    }
    async orderCustom(qrcode, confirmerId) {
        return await this.orderService(qrcode, confirmerId, models_1.QrcodeAction.OrderCustom);
    }
    async orderPublic(qrcode, confirmerId) {
        return await this.orderService(qrcode, confirmerId, models_1.QrcodeAction.OrderPublic);
    }
}
exports.QrcodeConfirm = QrcodeConfirm;
