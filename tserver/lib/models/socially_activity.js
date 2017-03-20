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
class SociallyActivity {
}
__decorate([
    utils_1.property(),
    __metadata("design:type", Number)
], SociallyActivity.prototype, "id", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], SociallyActivity.prototype, "creator", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], SociallyActivity.prototype, "createdat", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], SociallyActivity.prototype, "updator", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Date)
], SociallyActivity.prototype, "updatedat", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], SociallyActivity.prototype, "content", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], SociallyActivity.prototype, "holdtime", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], SociallyActivity.prototype, "holdaddress", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], SociallyActivity.prototype, "ifspot", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], SociallyActivity.prototype, "serviceobject", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], SociallyActivity.prototype, "accountid", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Number)
], SociallyActivity.prototype, "status", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Number)
], SociallyActivity.prototype, "integral", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", Number)
], SociallyActivity.prototype, "auditstatus", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], SociallyActivity.prototype, "approvalstatus", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], SociallyActivity.prototype, "limitNum", void 0);
__decorate([
    utils_1.property(),
    __metadata("design:type", String)
], SociallyActivity.prototype, "preIntegral", void 0);
exports.SociallyActivity = SociallyActivity;
exports.SociallyActivityTableName = 't_socially_activity';
