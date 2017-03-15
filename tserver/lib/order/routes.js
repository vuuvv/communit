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
let OrderController = class OrderController {
    async orderListByBuyer(ctx) {
        let orders = await db_1.raw(`
    select * from t_order where communityId = ? and buyerId = ?
    `, [ctx.session.communityId, ctx.session.userId]);
        let details = await db_1.raw(`
    select * from t_order_detail where orderId in (?)
    `, [orders.map((v) => v.id)]);
        for (let o of orders) {
            o.details = details.filter((d) => o.id === d.orderId);
        }
        return routes_1.success(orders);
    }
    async orderListBySeller(ctx) {
        let ret = await db_1.raw(`
    select * from t_order where communityId = ? and sellerId = ?
    `, [ctx.session.communityId, ctx.session.userId]);
        return routes_1.success(ret);
    }
    async List(ctx) {
        let transactions = await db_1.raw(`
    select t.*, tt.name as typeName from t_transaction as t
    join t_transaction_type as tt on t.typeId = tt.id
    where communityId = ? and userId = ?
    order by t.createdAt desc
    `, [ctx.session.communityId, ctx.session.userId]);
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
    routes_1.get('/buyer/list'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "orderListByBuyer", null);
__decorate([
    routes_1.get('/seller/list'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "orderListBySeller", null);
__decorate([
    routes_1.get('/list'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "List", null);
OrderController = __decorate([
    routes_1.router('/order')
], OrderController);
exports.OrderController = OrderController;
