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
        if (!data.buyerId || !data.productId || !confirmerId) {
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
        let order = new models_1.Order();
        order.type = models_1.OrderType.Product;
        order.sellerId = seller.id;
        order.buyerId = buyer.id;
        order.orderTime = order.payTime = order.tradeTime = new Date();
        let detail = new models_1.OrderDetail();
        detail.orderId = order.id;
        detail.type = models_1.OrderType.Product;
        detail.productId = data.productId;
        await db_1.db.transaction(async (trx) => {
            qrcode = await db_1.Table.Qrcode.transacting(trx).where('id', qrcode.id).forUpdate().first();
            if (!qrcode || new Date() > new Date(qrcode.expiresIn) || qrcode.status !== 'submit') {
                throw new Error('二维码已失效');
            }
            let product = await db_1.Table.Product.transacting(trx).where('id', data.productId).first();
            if (!product) {
                throw new Error('无效的产品');
            }
            // TODO: 检查商品状态
            let amount = order.amount = product.points;
            order.buyerTradeTransactionId = await account_1.deductPoints(trx, qrcode.communityId, buyer.userId, account_1.TransactionType.PayProduct, amount);
            order.sellerTradeTransactionId = await account_1.addPoints(trx, qrcode.communityId, seller.userId, account_1.AccountType.Normal, account_1.TransactionType.GetProduct, amount);
            order.status = models_1.OrderStatus.Done;
            await db_1.Table.Order.transacting(trx).insert(order);
            detail.points = amount;
            detail.data = JSON.stringify(product);
            await db_1.Table.OrderDetail.transacting(trx).insert(detail);
            return order;
        });
    }
}
exports.QrcodeConfirm = QrcodeConfirm;
