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
let MenuController = class MenuController {
    async bank(ctx) {
        let ret = await db_1.Table.BankMenu.orderBy('sort');
        return routes_1.success(ret);
    }
    async community(ctx) {
        let ret = await db_1.raw(`
       select id, name, IMAGE_HREF as image, showType from weixin_cms_menu
       where accountid = ? and (parentmenuid is null or parentmenuid = "") order by seq
      `, [ctx.session.communityId]);
        return routes_1.success(ret);
    }
    async communityChildren(ctx) {
        let parent = await db_1.first(`
      select id, name from weixin_cms_menu where id = ?
    `, [ctx.params.id]);
        let children = await db_1.raw(`
       select id, name from weixin_cms_menu
       where accountid = ? and parentmenuid = ? order by seq
      `, [ctx.session.communityId, ctx.params.id]);
        return routes_1.success({
            parent,
            children,
        });
    }
};
__decorate([
    routes_1.get('/bank'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "bank", null);
__decorate([
    routes_1.get('/community'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "community", null);
__decorate([
    routes_1.get('/community/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "communityChildren", null);
MenuController = __decorate([
    routes_1.router('/menu')
], MenuController);
exports.MenuController = MenuController;
