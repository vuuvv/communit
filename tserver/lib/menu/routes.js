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
        let ret = await db_1.raw(`
    select
      id, name, image_href as image
    from weixin_bank_menu as m1
    where m1.accountid = ? and (m1.ParentMenuId = '' or m1.ParentMenuId is null)
    order by m1.seq
    `, [ctx.session.communityId]);
        // let ret = await raw(`
        // select
        //   id, name, (
        //     select
        //       concat(
        //         '[',
        //         group_concat(json_object('id', id, 'name', name)),
        //         ']'
        //       )
        //     from t_weixin_bank_menu as m2 where m2.parentId=m1.id
        //     order by m2.seq
        //   ) as children
        // from t_weixin_bank_menu as m1
        // where m1.accountid = ? and (o1.parentId = '' or o1.parentId is null)
        // order by m1.seq
        // `, [ctx.session.communityId]);
        return routes_1.success(ret);
    }
    async bankChildren(ctx) {
        let ret = await db_1.raw(`
    select
      id, name, image_href as image
    from weixin_bank_menu as m1
    where m1.ParentMenuId = ?
    order by m1.seq
    `, [ctx.params.id]);
        return routes_1.success(ret);
    }
    async bankMenu(ctx) {
        let ret = await db_1.first(`
    select
      id, name, image_href as image
    from weixin_bank_menu as m1
    where m1.id = ?
    order by m1.seq
    `, [ctx.params.id]);
        return routes_1.success(ret);
    }
    async community(ctx) {
        let ret = await db_1.raw(`
       select id, name, IMAGE_HREF as image, showType, url from weixin_cms_menu
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
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "bank", null);
__decorate([
    routes_1.get('/bank/:id/children'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "bankChildren", null);
__decorate([
    routes_1.get('/bank/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "bankMenu", null);
__decorate([
    routes_1.get('/community'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "community", null);
__decorate([
    routes_1.get('/community/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "communityChildren", null);
MenuController = __decorate([
    routes_1.router('/menu')
], MenuController);
exports.MenuController = MenuController;
