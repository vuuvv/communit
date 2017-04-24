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
class QrcodeAction {
}
QrcodeAction.OrderProduct = 'orderProduct';
QrcodeAction.OrderHelp = 'orderHelp';
QrcodeAction.OrderCustom = 'orderCustom';
QrcodeAction.OrderPublic = 'orderPublic';
QrcodeAction.ActivityCheck = 'activityCheck';
QrcodeAction.OrderService = 'orderService';
exports.QrcodeAction = QrcodeAction;
const tips = {};
tips[QrcodeAction.OrderProduct] = '向商家支付积分';
tips[QrcodeAction.OrderHelp] = '向求助者收取积分';
tips[QrcodeAction.OrderCustom] = '向服务者支付积分';
tips[QrcodeAction.OrderPublic] = '向求助者收取积分';
tips[QrcodeAction.ActivityCheck] = '活动参与者扫码签到';
tips[QrcodeAction.OrderService] = '服务支付或收取积分';
class Qrcode extends base_model_1.BaseModel {
    constructor(communityId, action, data) {
        super();
        this.communityId = communityId;
        this.action = action;
        this.status = 'submit';
        this.data = data ? JSON.stringify(data) : null;
        this.expiresIn = new Date(new Date().getTime() + 5 * 60 * 1000);
        this.tip = tips[this.action] || null;
    }
}
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Qrcode.prototype, "communityId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Qrcode.prototype, "action", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Qrcode.prototype, "data", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Qrcode.prototype, "tip", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], Qrcode.prototype, "status", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], Qrcode.prototype, "expiresIn", void 0);
exports.Qrcode = Qrcode;
exports.QrcodeTableName = 't_qrcode';
