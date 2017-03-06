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
const db_1 = require("../db");
const utils_2 = require("../utils");
let SignupController = class SignupController {
    /**
     * 用户填写注册信息, 生成用户
     */
    async signup(ctx) {
        const wechatAccountId = ctx.session.communityId;
        const tel = ctx.session.verifiedPhone;
        const wechatUserId = ctx.session.wechatUserId;
        let account = await db_1.Table.WechatOfficialAccount.where('id', wechatAccountId);
        if (!account) {
            throw new routes_1.ResponseError('无效的公众号: ' + wechatAccountId);
        }
        if (!tel) {
            throw new routes_1.ResponseError('请先验证手机');
        }
        let body = await utils_1.getRawBody(ctx);
        const model = JSON.parse(body.toString());
        if (!model.name) {
            throw new routes_1.ResponseError('请填写您的姓名');
        }
        if (!model.area) {
            throw new routes_1.ResponseError('请填写您所在的小区');
        }
        if (!model.address) {
            throw new routes_1.ResponseError('请填写您的地址');
        }
        model.phone = tel;
        await db_1.db.transaction(async (trx) => {
            let user = await db_1.Table.User.transacting(trx).where('username', tel).forUpdate().first();
            if (user) {
                // 用户已存在, 检查在该社区是否存在
                let wechatUser = await db_1.Table.WechatUser.transacting(trx).where({
                    userId: user.id,
                    officialAccountId: wechatAccountId,
                });
                if (wechatUser) {
                    throw new routes_1.ResponseError('用户已存在');
                }
                await db_1.Table.WechatUser.transacting(trx).where('id', wechatUser.id).update({
                    userId: user.id,
                    realname: model.name,
                    area: model.area,
                    address: model.address,
                });
            }
            let userId = utils_2.uuid();
            let ids = await db_1.Table.User.transacting(trx).insert({
                ID: userId,
                username: tel,
            }).select('ID');
            if (wechatUserId) {
                let wUser = await db_1.Table.WechatUser.where('id', wechatUserId).first();
                if (wUser) {
                    await db_1.Table.WechatUser.transacting(trx).where('id', wechatUserId).update({
                        userId: userId,
                        realname: model.name,
                        area: model.area,
                        address: model.address,
                    });
                }
            }
            ctx.session.userId = userId;
        });
        delete ctx.session.verifiedPhone;
        delete ctx.session.wechatUserid;
        return routes_1.success();
    }
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
        ctx.session.verifiedPhone = data.tel;
        return routes_1.success();
    }
    async getVerify(ctx) {
        return routes_1.success(ctx.session.verifiedPhone);
    }
    async crash() {
        process.nextTick(() => {
            throw new Error('application crash test');
        });
    }
    async login(ctx) {
        const user = await db_1.Table.WechatUser.first();
        ctx.session.userId = user.userId;
        ctx.session.communityId = user.officialAccountId;
        console.log(user.userId, user.officialAccountId);
        return user;
    }
};
__decorate([
    routes_1.post('/create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignupController.prototype, "signup", null);
__decorate([
    routes_1.post('/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignupController.prototype, "createVerify", null);
__decorate([
    routes_1.get('/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignupController.prototype, "getVerify", null);
__decorate([
    routes_1.get('/crash'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SignupController.prototype, "crash", null);
__decorate([
    routes_1.get('/login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignupController.prototype, "login", null);
SignupController = __decorate([
    routes_1.router('/signup')
], SignupController);
exports.SignupController = SignupController;
