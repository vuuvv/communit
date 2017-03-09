import { Response, ResponseError } from '../routes';
import { create, getJsonBody } from '../utils';
import { Table } from '../db';
import { Store } from '../models';

export async function getProductModel(ctx) {
  let product = await getJsonBody(ctx);

  console.log(product);

  if (!product.categoryId) {
    throw new ResponseError('请选择商品种类');
  }

  if (!product.title) {
    throw new ResponseError('请填写商品标题');
  }

  if (!product.points) {
    throw new ResponseError('请填写商品积分');
  }

  if (!product.price) {
    throw new ResponseError('请填写商品售价');
  }

  if (!product.normalPrice) {
    throw new ResponseError('请填写商品原价');
  }

  if (!product.description) {
    throw new ResponseError('请填写商品简介');
  }

  if (product.points + product.price > product.normalPrice) {
    throw new ResponseError('积分+积分售价的总额不得超过商品的原价');
  }

  return product;
}
