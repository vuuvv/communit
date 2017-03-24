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
const base_model_1 = require("./base_model");
const utils_1 = require("../utils");
class OrderType {
}
OrderType.Product = 'product';
OrderType.Service = 'service';
OrderType.Activity = 'activity';
exports.OrderType = OrderType;
class OrderStatus {
}
OrderStatus.Done = 'done';
OrderStatus.Reject = 'reject';
exports.OrderStatus = OrderStatus;
class Order extends base_model_1.BaseModel {
}
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Order.prototype, "type", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Order.prototype, "communityId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Order.prototype, "buyerId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Order.prototype, "sellerId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Number)
], Order.prototype, "amount", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], Order.prototype, "orderTime", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], Order.prototype, "payTime", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], Order.prototype, "tradeTime", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], Order.prototype, "refundTime", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Order.prototype, "orderTransactionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Order.prototype, "orderRefundTransactionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Order.prototype, "buyerTradeTransactionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Order.prototype, "sellerTradeTransactionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Order.prototype, "buyerRefundTransactionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Order.prototype, "sellerRefundTransactionId", void 0);
exports.Order = Order;
exports.OrderTableName = 't_order';
