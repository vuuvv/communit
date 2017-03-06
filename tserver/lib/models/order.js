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
class TransactionType extends base_model_1.BaseModel {
}
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionType.prototype, "typeId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionType.prototype, "buyerId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionType.prototype, "sellerId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionType.prototype, "amount", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionType.prototype, "status", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], TransactionType.prototype, "orderTime", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], TransactionType.prototype, "payTime", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], TransactionType.prototype, "tradeTime", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], TransactionType.prototype, "refundTime", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionType.prototype, "orderTransactionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionType.prototype, "orderRefundTransactionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionType.prototype, "buyerTradeTransactionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionType.prototype, "sellerTradeTransactionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionType.prototype, "buyerRefundTransactionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionType.prototype, "sellerRefundTransactionId", void 0);
exports.TransactionType = TransactionType;
exports.ConfigTableName = 't_transaction';
