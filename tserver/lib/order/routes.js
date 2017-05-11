"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const _ = require("lodash");
const routes_1 = require("../routes");
const db_1 = require("../db");
const utils_1 = require("../utils");
const models_1 = require("../models");
const account_1 = require("../account");
let OrderController = class OrderController {
    async buy(ctx) {
        let userId = ctx.session.userId;
        let communityId = ctx.session.communityId;
        let p = await utils_1.getJsonBody(ctx);
        if (!p.productId) {
            throw new Error('请传入商品Id');
        }
        if (p.count < 1) {
            throw new Error('购买的商品数量必须大于1');
        }
        let product = await db_1.Table.Product.where('id', p.productId).first();
        if (!product) {
            throw new Error('无效的商品Id');
        }
        if (product.status !== 'online') {
            throw new Error('该商品不可购买');
        }
        let store = await db_1.Table.Store.where('id', product.storeId).first();
        if (!store || store.status !== 'normal') {
            throw new Error('该商品所属店铺已关闭， 不可购买');
        }
        if (store.communityId !== communityId) {
            throw new Error('该商品所属店铺不属于本社区，不可购买');
        }
        let order = new models_1.Order();
        order.type = models_1.OrderType.Product;
        order.communityId = communityId;
        order.sellerId = product.storeId;
        order.buyerId = userId;
        order.status = models_1.OrderStatus.Payed;
        order.amount = product.points * Math.ceil(p.count);
        order.orderTime = order.payTime = new Date();
        let detail = new models_1.OrderDetail();
        detail.orderId = order.id;
        detail.type = models_1.OrderType.Product;
        detail.productId = product.id;
        detail.data = JSON.stringify(product);
        detail.points = product.points;
        await db_1.db.transaction(async (trx) => {
            order.buyerTradeTransactionId = await account_1.deductPoints(trx, communityId, order.buyerId, account_1.TransactionType.PayProduct, order.amount, order.id);
            await db_1.Table.Order.transacting(trx).insert(order);
            await db_1.Table.OrderDetail.transacting(trx).insert(detail);
        });
        return routes_1.success(order);
    }
    async storeOrderList(ctx) {
        let userId = ctx.session.userId;
        let communityId = ctx.session.communityId;
        let ret;
        let orders = await db_1.raw(`
    select o.*, s.name from t_order as o
    join t_store as s on o.sellerId = s.id
    where s.userId = ? and s.communityId = ?
    order by o.updatedAt desc
    `, [userId, communityId]);
        if (!orders.length) {
            return routes_1.success([]);
        }
        let details = await db_1.raw(`
    select * from t_order_detail where orderId in (?)
    `, [orders.map((v) => v.id)]);
        for (let o of orders) {
            o.details = details.filter((d) => o.id === d.orderId);
        }
        return routes_1.success(orders);
    }
    async orderList(ctx) {
        let userId = ctx.session.userId;
        let ret;
        if (ctx.params.type === models_1.OrderType.Product) {
            let orders = await db_1.raw(`
      select o.*, s.name from t_order as o
      join t_store as s on o.sellerId = s.id
      where o.buyerId = ? and o.type = ?
      order by o.updatedAt desc
      `, [userId, models_1.OrderType.Product]);
            if (!orders.length) {
                return routes_1.success([]);
            }
            let details = await db_1.raw(`
      select * from t_order_detail where orderId in (?)
      `, [orders.map((v) => v.id)]);
            for (let o of orders) {
                o.details = details.filter((d) => o.id === d.orderId);
            }
            ret = orders;
        }
        else if (ctx.params.type === models_1.OrderType.Activity) {
            let orders = await db_1.raw(`
      select
        o.*, od.data, if(wu1.userId=s.userId, wu2.realname, wu1.realname) as name,
        wa.accountname as communityName, sc.name as categoryName,
        od.points as points, s.userId as ownerId
      from t_order as o
      join t_order_detail as od on o.id = od.orderId
      left join t_wechat_user as wu1 on wu1.officialAccountId = o.communityId and wu1.userId = o.buyerId
      left join t_wechat_user as wu2 on wu2.officialAccountId = o.communityId and wu2.userId = o.sellerId
      left join weixin_account as wa on wa.id = o.buyerId
      left join t_service_user as su on od.productId = su.id
      left join t_service as s on su.serviceId = s.id
      left join t_service_category as sc on s.categoryId = sc.id
      where o.communityId = ? and (o.buyerId = ? or o.sellerId = ?) and o.type in ('service', 'activity')
      `, [ctx.session.communityId, userId, userId]);
            ret = orders;
        }
        return routes_1.success(ret);
    }
    async List(ctx) {
        let userId = ctx.session.userId;
        if (ctx.params.type === 'store') {
            let store = await db_1.Table.Store.where({
                communityId: ctx.session.communityId,
                userId: ctx.session.userId,
            }).first();
            if (!store) {
                throw new Error('您还未开店，没有店铺订单');
            }
            userId = store.id;
        }
        let transactions = await db_1.raw(`
    select t.*, tt.name as typeName from t_transaction as t
    join t_transaction_type as tt on t.typeId = tt.id
    where communityId = ? and userId = ?
    order by t.createdAt desc
    `, [ctx.session.communityId, userId]);
        if (!transactions || !transactions.length) {
            return routes_1.success(transactions);
        }
        let tids = transactions.map(t => t.id);
        let orders = await db_1.raw(`
    select * from t_order
      where
        buyerTradeTransactionId in (?) or
        sellerTradeTransactionId in (?) or
        buyerRefundTransactionId in (?) or
        sellerRefundTransactionId in (?)
    `, [tids, tids, tids, tids]);
        let details = await db_1.raw(`
    select * from t_order_detail where orderId in (?)
    `, [orders.map((v) => v.id)]);
        for (let o of orders) {
            o.details = details.filter((d) => o.id === d.orderId);
        }
        for (let t of transactions) {
            // for (let o of orders) {
            //   if (o.buyerTradeTransactionId === t.id) {
            //     t.order = o;
            //     break;
            //   }
            // }
            t.order = _.find(orders, (o) => o.buyerTradeTransactionId === t.id ||
                o.sellerTradeTransactionId === t.id ||
                o.buyerRefundTransactionId === t.id ||
                o.sellerRefundTransactionId === t.id);
        }
        return routes_1.success(transactions);
    }
};
__decorate([
    routes_1.post('/buy/product'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "buy", null);
__decorate([
    routes_1.get('/store'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "storeOrderList", null);
__decorate([
    routes_1.get('/list/:type'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "orderList", null);
__decorate([
    routes_1.get('/:type/list'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "List", null);
OrderController = __decorate([
    routes_1.router('/order')
], OrderController);
exports.OrderController = OrderController;
