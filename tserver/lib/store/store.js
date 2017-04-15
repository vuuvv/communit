"use strict";
const routes_1 = require("../routes");
const utils_1 = require("../utils");
const db_1 = require("../db");
const models_1 = require("../models");
async function getStore(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;
    if (!communityId) {
        throw new routes_1.ResponseError('没有社区信息, 请退出后重新进入');
    }
    let store = await db_1.Table.Store.where({
        communityId: communityId,
        userId: userId,
    }).first();
    return utils_1.create(models_1.Store, store);
}
exports.getStore = getStore;
async function getStoreModel(ctx) {
    let store = await utils_1.getJsonBody(ctx);
    if (!store.name) {
        throw new routes_1.ResponseError('请填写店铺名称');
    }
    if (!store.tel) {
        throw new routes_1.ResponseError('请填写联系电话');
    }
    if (!store.contact) {
        throw new routes_1.ResponseError('请填写联系人');
    }
    if (!store.address) {
        throw new routes_1.ResponseError('请填写店铺地址');
    }
    if (!store.description) {
        throw new routes_1.ResponseError('请填写店铺简介');
    }
    if (!store.businessLicense) {
        throw new routes_1.ResponseError('请上传营业执照');
    }
    if (!store.legalRepresentativeIdPicture) {
        throw new routes_1.ResponseError('请上传法人代表身份证');
    }
    return store;
}
exports.getStoreModel = getStoreModel;
