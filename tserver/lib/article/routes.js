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
let ArticlesController = class ArticlesController {
    async home(ctx) {
        let ret = await db_1.raw(`
      select a.id, a.title, a.summary as \`desc\`, a.create_date as date, m.name as type from weixin_cms_article as a
      join weixin_cms_menu as m on m.id=a.column_id
      where m.accountid=? order by a.create_date desc
      limit 10
    `, [ctx.session.communityId]);
        return routes_1.success(ret);
    }
    async item(ctx) {
        const id = ctx.params.id;
        let category = await db_1.first('select name from weixin_cms_menu where id=?', [id]);
        let ret = await db_1.raw('select id, title, summary as `desc`, left(create_date, 10) as date from weixin_cms_article where column_id=? order by create_date desc', [id]);
        return routes_1.success({
            category: category.name,
            list: ret,
        });
    }
};
__decorate([
    routes_1.get('/home'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "home", null);
__decorate([
    routes_1.get('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "item", null);
ArticlesController = __decorate([
    routes_1.router('/articles')
], ArticlesController);
exports.ArticlesController = ArticlesController;
let ArticleController = class ArticleController {
    async item(ctx) {
        const id = ctx.params.id;
        let article = await db_1.first(`
    select wa.id, wa.title, mm.name as category, wa.content, wa.create_name as \`from\` from weixin_cms_article as wa
    join weixin_cms_menu as mm on wa.column_id = mm.id
    where wa.id = ?
    `, [ctx.params.id]);
        return routes_1.success(article);
    }
};
__decorate([
    routes_1.get('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "item", null);
ArticleController = __decorate([
    routes_1.router('/article')
], ArticleController);
exports.ArticleController = ArticleController;
