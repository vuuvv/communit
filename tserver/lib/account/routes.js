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
const routes_1 = require("../routes");
const db_1 = require("../db");
const account_1 = require("../account");
function sum(array, fn) {
    let ret = 0;
    array.forEach((item) => {
        let n = fn(item) || 0;
        ret += n;
    });
    return ret;
}
function sumif(array, fn) {
    let ret = 0;
    array.forEach((item) => {
        if (fn(item)) {
            ret += item.amount || 0;
        }
    });
    return ret;
}
let AccountController = class AccountController {
    async balance(ctx) {
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        if (!userId) {
            return routes_1.success(0);
        }
        let balance = await account_1.getUserBalance(communityId, userId);
        return routes_1.success(balance);
    }
    async summary(ctx) {
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        let balance = await db_1.raw(`
    select at.id, at.name, sum(if(a.balance is null, 0, a.balance)) as amount from t_account_type as at
    left join t_account as a on at.id = a.typeId and a.communityId = ? and a.userId = ?
		group by at.id
    `, [communityId, userId]);
        let total = await db_1.raw(`
    select at.id, at.name, sum(if(a.total is null, 0, a.total)) as amount from t_account_type as at
    left join t_account_detail as a on at.id = a.typeId and a.communityId = ? and a.userId = ?
		group by at.id
    `, [communityId, userId]);
        let detail = await db_1.raw(`
    select tt.id, tt.name, sum(if(t.amount is null, 0, t.amount)) as amount, ad.typeId from t_transaction_type as tt
    left join t_transaction as t on tt.id=t.typeId and t.communityId = ? and t.userId = ? and t.createdAt > CONCAT(DATE_FORMAT( CURDATE( ) , '%Y%m' ), '01')
    left join t_transaction_detail as td on t.id = td.transactionId
    left join t_account_detail as ad on td.accountDetailId = ad.id
    group by tt.id, ad.typeId
    `, [communityId, userId]);
        return routes_1.success({
            activityBalance: sumif(balance, (item) => item.id === account_1.AccountType.Normal),
            activityTotal: sumif(total, (item) => item.id === account_1.AccountType.Normal),
            activityGet: sumif(detail, (item) => item.typeId === account_1.AccountType.Normal && [account_1.TransactionType.GetActivity, account_1.TransactionType.RefundGetActivity, account_1.TransactionType.GetService].indexOf(item.id) !== -1),
            activityPay: -sumif(detail, (item) => item.typeId === account_1.AccountType.Normal && [account_1.TransactionType.PayActivity, account_1.TransactionType.PayProduct, account_1.TransactionType.PayService].indexOf(item.id) !== -1),
            buyBalance: sumif(balance, (item) => item.id === account_1.AccountType.Buy),
            buyTotal: sumif(total, (item) => item.id === account_1.AccountType.Buy),
            buyGet: sumif(detail, (item) => item.typeId === account_1.AccountType.Buy && [account_1.TransactionType.GetActivity, account_1.TransactionType.RefundGetActivity, account_1.TransactionType.GetService].indexOf(item.id) !== -1),
            buyPay: -sumif(detail, (item) => item.typeId === account_1.AccountType.Buy && [account_1.TransactionType.PayActivity, account_1.TransactionType.PayProduct, account_1.TransactionType.PayService].indexOf(item.id) !== -1),
        });
    }
    async add(ctx) {
    }
    async edit(ctx) {
    }
};
__decorate([
    routes_1.get('/balance'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "balance", null);
__decorate([
    routes_1.get('/summary'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "summary", null);
__decorate([
    routes_1.post('/add'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "add", null);
__decorate([
    routes_1.post('/edit'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "edit", null);
AccountController = __decorate([
    routes_1.router('/account')
], AccountController);
exports.AccountController = AccountController;
