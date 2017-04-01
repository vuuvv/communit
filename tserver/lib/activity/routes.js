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
const _ = require("lodash");
const routes_1 = require("../routes");
const db_1 = require("../db");
const utils_1 = require("../utils");
const models_1 = require("../models");
let ActivityController = class ActivityController {
    async type(ctx) {
        let data = await utils_1.getJsonBody(ctx);
        let activity = new models_1.SociallyActivity();
        activity.createdat = activity.updatedat = new Date();
        activity.creator = activity.updator = ctx.session.userId;
        for (let key of Object.keys(data)) {
            activity[key] = data[key];
        }
        activity.status = 1;
        activity.accountid = ctx.session.communityId;
        let ids = await db_1.Table.SociallyActivity.insert(activity).select('id');
        let user = new models_1.SociallyActivityUser();
        user.activityId = ids[0];
        user.communityId = ctx.session.communityId;
        user.userId = ctx.session.userId;
        await db_1.Table.SociallyActivityUser.insert(user);
        return routes_1.success();
    }
    async start(ctx) {
        let activity = await db_1.Table.SociallyActivity.where('id', ctx.params.id).first();
        if (!activity) {
            throw new Error('无此活动');
        }
        if (activity.status !== 1) {
            throw new Error('该活动不可进行该操作');
        }
        await db_1.Table.SociallyActivity.where('id', ctx.params.id).update({
            status: 2,
        });
        return routes_1.success();
    }
    async join(ctx) {
        let activity = await db_1.Table.SociallyActivity.where('id', ctx.params.id).first();
        if (!activity) {
            throw new Error('无此活动');
        }
        if (activity.status !== 1) {
            throw new Error('该活动不可进行该操作');
        }
        let user = await db_1.Table.SociallyActivityUser.where({
            activityId: activity.id,
            userId: ctx.session.userId,
        }).first();
        if (user) {
            throw new Error('用户已报名该活动，不可重复报名');
        }
        let suser = new models_1.SociallyActivityUser();
        suser.activityId = activity.id;
        suser.communityId = ctx.session.communityId;
        suser.userId = ctx.session.userId;
        await db_1.Table.SociallyActivityUser.insert(suser);
        return routes_1.success();
    }
    async item(ctx) {
        let activity = await db_1.first(`
    select sa.* from t_socially_activity as sa
    where sa.id = ?
    `, [ctx.params.id]);
        let users = await db_1.raw(`
    select wu.*, au.status, au.points from t_socially_activity_user as au
    join t_wechat_user as wu on au.communityId=wu.officialAccountId and au.userId=wu.userId
    where au.activityId = ?
    `, [ctx.params.id]);
        let me = _.find(users, (u) => u.officialAccountId === ctx.session.communityId && u.userId === ctx.session.userId);
        return routes_1.success({
            activity,
            users,
            me,
        });
    }
    async search(ctx) {
        let ret = await db_1.raw(`
    select sa.* from t_socially_activity as sa
    where sa.accountid = ?
    order by updatedat
    `, [ctx.session.communityId]);
        return routes_1.success(ret);
    }
};
__decorate([
    routes_1.post('/add'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "type", null);
__decorate([
    routes_1.post('/start/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "start", null);
__decorate([
    routes_1.post('/join/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "join", null);
__decorate([
    routes_1.get('/item/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "item", null);
__decorate([
    routes_1.get('/search'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "search", null);
ActivityController = __decorate([
    routes_1.router('/activity')
], ActivityController);
exports.ActivityController = ActivityController;
