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
const utils_1 = require("../utils");
let UserController = class UserController {
    /**
     * 手机号验证
     */
    async createVerify(ctx) {
        let body = await utils_1.getRawBody(ctx);
        const data = JSON.parse(body.toString());
        if (!data.tel) {
            throw new routes_1.ResponseError('请填写验证手机号');
        }
        if (!data.code) {
            throw new routes_1.ResponseError('请填写验证码');
        }
        // TODO: 加入验证逻辑
        ctx.session.verify_tel = data.tel;
        return routes_1.success();
    }
    async getVerify(ctx) {
        return routes_1.success(ctx.session.verify_tel);
    }
};
__decorate([
    routes_1.post('/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createVerify", null);
__decorate([
    routes_1.get('/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getVerify", null);
UserController = __decorate([
    routes_1.router('/user')
], UserController);
exports.UserController = UserController;
