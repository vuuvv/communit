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
const utils_1 = require("../utils");
const base_model_1 = require("./base_model");
class WechatOfficialAccount extends base_model_1.BaseModel {
}
__decorate([
    utils_1.property('accountname'),
    __metadata("design:type", String)
], WechatOfficialAccount.prototype, "name", void 0);
__decorate([
    utils_1.property('accountappid'),
    __metadata("design:type", String)
], WechatOfficialAccount.prototype, "appId", void 0);
__decorate([
    utils_1.property('accountappsecret'),
    __metadata("design:type", String)
], WechatOfficialAccount.prototype, "appSecret", void 0);
__decorate([
    utils_1.property('accounttoken'),
    __metadata("design:type", String)
], WechatOfficialAccount.prototype, "token", void 0);
__decorate([
    utils_1.property('accountaccesstoken'),
    __metadata("design:type", String)
], WechatOfficialAccount.prototype, "accessToken", void 0);
__decorate([
    utils_1.property('ADDTOEKNTIME'),
    __metadata("design:type", Date)
], WechatOfficialAccount.prototype, "expiresIn", void 0);
exports.WechatOfficialAccount = WechatOfficialAccount;
exports.WechatOfficialAccountTableName = 'weixin_account';
