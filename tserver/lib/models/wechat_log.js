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
class WechatLog extends base_model_1.BaseModel {
}
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], WechatLog.prototype, "officialAccountId", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], WechatLog.prototype, "request", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], WechatLog.prototype, "responst", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], WechatLog.prototype, "type", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], WechatLog.prototype, "event", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], WechatLog.prototype, "from", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], WechatLog.prototype, "to", void 0);
exports.WechatLog = WechatLog;
exports.WechatLogTableName = 't_wechat_log';
