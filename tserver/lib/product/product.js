"use strict";
const routes_1 = require("../routes");
const utils_1 = require("../utils");
async function getProductModel(ctx) {
    let product = await utils_1.getJsonBody(ctx);
    if (!product.categoryId) {
        throw new routes_1.ResponseError('请选择商品种类');
    }
    if (!product.title) {
        throw new routes_1.ResponseError('请填写商品标题');
    }
    if (!product.points) {
        throw new routes_1.ResponseError('请填写商品积分');
    }
    if (!product.price) {
        throw new routes_1.ResponseError('请填写商品售价');
    }
    if (!product.normalPrice) {
        throw new routes_1.ResponseError('请填写商品原价');
    }
    if (!product.description) {
        throw new routes_1.ResponseError('请填写商品简介');
    }
    if (!product.stock) {
        throw new routes_1.ResponseError('请填写商品库存');
    }
    if (product.points + product.price > product.normalPrice) {
        throw new routes_1.ResponseError('积分+积分售价的总额不得超过商品的原价');
    }
    return product;
}
exports.getProductModel = getProductModel;
