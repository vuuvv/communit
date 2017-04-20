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
const ejs = require("ejs");
const routes_1 = require("../routes");
const db_1 = require("../db");
const utils_1 = require("../utils");
const models_1 = require("../models");
const account_1 = require("../account");
let ServiceController = class ServiceController {
    async categories(ctx) {
        let ret = await db_1.Table.ServiceCategory.orderBy('sort');
        return routes_1.success(ret);
    }
    async category(ctx) {
        let ret = await db_1.Table.ServiceCategory.where('id', ctx.params.id).first();
        return routes_1.success(ret);
    }
    async types(ctx) {
        let ret = await db_1.Table.ServiceType.where('categoryId', ctx.params.id).orderBy('sort');
        return routes_1.success(ret);
    }
    async list(ctx) {
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        let sql = `
    select
      s.*,
      (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='submit') as submitCount,
      (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='accept') as acceptCount,
      (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='done') as doneCount,
      c.name as categoryName, t.icon as typeIcon, t.name as typeName, wu.realname as userName
    from t_service as s
    join t_service_category as c on s.categoryId = c.id
    join t_service_type as t on s.typeId = t.id
    join t_wechat_user as wu on wu.officialAccountId = s.communityId and wu.userId = s.userId
    where s.communityId = ? and s.userId = ? and s.categoryId = ?
    `;
        let ret = await db_1.raw(sql, [communityId, userId, models_1.ServiceCategories.Custom]);
        return routes_1.success(ret);
    }
    async search(ctx) {
        let communityId = ctx.session.communityId;
        let sql = `
      select s.*, c.name as categoryName, t.icon as typeIcon, t.name as typeName, wu.realname as userName from t_service as s
      join t_service_category as c on s.categoryId = c.id
      join t_service_type as t on s.typeId = t.id
      join t_wechat_user as wu on wu.officialAccountId = s.communityId and wu.userId = s.userId
      where
        s.communityId = :communityId and s.status = 'normal' and
        <% if (query.categoryId) { %> s.categoryId = :categoryId <% } else { %> 1 = 1 <% } %> and
        <% if (query.typeId) { %> s.typeId = :typeId  <% } else { %> 1 = 1 <% } %>
      order by s.updatedAt desc
    `;
        sql = ejs.render(sql, ctx);
        let ret = await db_1.raw(sql, Object.assign({ communityId: communityId }, ctx.query));
        return routes_1.success(ret);
    }
    async item(ctx) {
        let serviceId = ctx.params.id;
        let sql = `
      select
        s.*, c.name as categoryName, c.fields, t.name as typeName, wu.realname as userName,
        (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='submit') as submitCount,
        (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='accept') as acceptCount,
        (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='done') as doneCount
      from t_service as s
      join t_service_category as c on s.categoryId = c.id
      join t_service_type as t on s.typeId = t.id
      join t_wechat_user as wu on wu.officialAccountId=s.communityId and wu.userId=s.userId
      where
        s.id = ?
      order by s.updatedAt desc
    `;
        let service = await db_1.first(sql, [serviceId]);
        let userId = ctx.session.userId;
        if (!userId) {
            return routes_1.success({
                service,
            });
        }
        // 已注册用户
        sql = `
    select su.* from t_service_user as su
    join t_service as s on su.serviceId = s.id
    where s.id = ? and su.userId = ?
    order by su.updatedAt desc
    limit 1
    `;
        let user = await db_1.first(sql, [serviceId, userId]);
        return routes_1.success({
            service,
            user,
        });
    }
    async add(ctx) {
        let model = await utils_1.getJsonBody(ctx);
        let category = await db_1.Table.ServiceCategory.where('id', ctx.params.id).first();
        if (!category) {
            throw new routes_1.ResponseError('非法类型');
        }
        let service = new models_1.Service();
        service.categoryId = category.id;
        service.communityId = ctx.session.communityId;
        service.userId = ctx.session.userId;
        service.content = JSON.stringify(model);
        service.typeId = model.type;
        service.points = model.points;
        await db_1.Table.Service.insert(service);
        return routes_1.success();
    }
    async users(ctx) {
        let sql = `
    select su.*, wu.realname  from t_service_user as su
    join t_wechat_user as wu on su.communityId = wu.officialAccountId and su.userId = wu.userId
    where su.serviceId = ? and su.status = ?
    order by su.updatedAt desc
    `;
        let ret = await db_1.raw(sql, [ctx.params.id, ctx.params.status]);
        return routes_1.success(ret);
    }
    async join(ctx) {
        let model = await utils_1.getJsonBody(ctx);
        let entity = utils_1.create(models_1.ServiceUser, model);
        entity.serviceId = ctx.params.id;
        entity.communityId = ctx.session.communityId;
        entity.userId = ctx.session.userId;
        entity.status = 'submit';
        await db_1.db.transaction(async (trx) => {
            // 检查用户是否已经参加
            let user = await db_1.Table.ServiceUser.transacting(trx).where({
                serviceId: ctx.params.id,
                communityId: ctx.session.communityId,
                userId: ctx.session.userId,
            }).orderBy('updatedAt', 'desc').forUpdate().first();
            if (!user || user.status !== 'reject') {
                // 可以添加报名记录
                await db_1.Table.ServiceUser.transacting(trx).insert(entity);
            }
            else {
                throw new Error(`不可重复添加报名记录`);
            }
        });
        return routes_1.success();
    }
    async quit(ctx) {
        let id = ctx.params.id;
        await db_1.db.transaction(async (trx) => {
            let user = await db_1.Table.ServiceUser.transacting(trx).forUpdate().where('id', id).first();
            if (user && ['accept', 'submit'].indexOf(user.status) !== -1) {
                await db_1.Table.ServiceUser.transacting(trx).where('id', id).update({
                    status: 'quit',
                });
                if (user.orderId) {
                    account_1.refundOrder(trx, user.orderId);
                }
            }
            else {
                throw new Error(`不可退出`);
            }
        });
        return routes_1.success();
    }
    async accept(ctx) {
        let serviceId = ctx.params.id;
        let ids = await utils_1.getJsonBody(ctx);
        if (!ids || ids.length) {
            return routes_1.success();
        }
        await db_1.db.transaction(async (trx) => {
            let service = await db_1.Table.Service.transacting(trx).forUpdate().where('id', serviceId).first();
            if (!service || service.status === 'closed') {
                throw new Error('服务不存在或服务已关闭');
            }
            for (let id of ids) {
                let user = await db_1.Table.ServiceUser.transacting(trx).forUpdate().where('id', id).first();
                if (!user || user.status !== 'submit') {
                    throw new Error('所选的用户并未参与，或状态不对, 请重新选择');
                }
                let order = new models_1.Order();
                order.type = models_1.OrderType.Product;
                order.communityId = service.communityId;
                order.sellerId = service.categoryId === models_1.ServiceCategories.Custom ? service.userId : user.userId;
                order.buyerId = service.categoryId === models_1.ServiceCategories.Custom ? user.userId : service.userId;
                order.status = models_1.OrderStatus.Payed;
                order.amount = user.points;
                order.orderTime = order.payTime = new Date();
                let detail = new models_1.OrderDetail();
                detail.orderId = order.id;
                detail.type = models_1.OrderType.Service;
                detail.productId = service.id;
                detail.data = JSON.stringify(service);
                detail.points = user.points;
                order.buyerTradeTransactionId = await account_1.deductPoints(trx, service.communityId, order.buyerId, account_1.TransactionType.PayService, order.amount);
                await db_1.Table.Order.transacting(trx).insert(order);
                await db_1.Table.OrderDetail.transacting(trx).insert(detail);
            }
        });
        return routes_1.success();
    }
};
__decorate([
    routes_1.get('/categories'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "categories", null);
__decorate([
    routes_1.get('/category/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "category", null);
__decorate([
    routes_1.get('/types/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "types", null);
__decorate([
    routes_1.get('/list'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "list", null);
__decorate([
    routes_1.get('/search'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "search", null);
__decorate([
    routes_1.get('/item/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "item", null);
__decorate([
    routes_1.post('/add/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "add", null);
__decorate([
    routes_1.get('/:id/users/:status'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "users", null);
__decorate([
    routes_1.post('/:id/join'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "join", null);
__decorate([
    routes_1.post('/:id/quit'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "quit", null);
__decorate([
    routes_1.post('/:id/accept'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "accept", null);
ServiceController = __decorate([
    routes_1.router('/service')
], ServiceController);
exports.ServiceController = ServiceController;
