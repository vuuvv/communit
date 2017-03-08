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
class TransactionDetail extends base_model_1.BaseModel {
}
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionDetail.prototype, "transactionId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionDetail.prototype, "userId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], TransactionDetail.prototype, "accountId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Number)
], TransactionDetail.prototype, "amount", void 0);
exports.TransactionDetail = TransactionDetail;
exports.TransactionDetailTableName = 't_transaction_detail';
