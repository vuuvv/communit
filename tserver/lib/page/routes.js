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
let PageController = class PageController {
    /**
     * 错误提示页面
     * @param ctx
     */
    async error(ctx) {
        ctx.state = {
            title: 'app'
        };
        console.log('here');
        await ctx.render('error', { message: 'John' });
    }
    async ok(ctx) {
        await utils_1.successPage(ctx, '操作成功', '订单交易成功');
    }
};
__decorate([
    routes_1.get('/error'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "error", null);
__decorate([
    routes_1.get('/ok'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "ok", null);
PageController = __decorate([
    routes_1.router('/page')
], PageController);
exports.PageController = PageController;
