import * as _ from 'lodash';

import { router, get, post, success, Response, ResponseError, login } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody } from '../utils';
import { Account, Product, Qrcode, QrCodeType } from '../models';

@router('/order')
export class OrderController {
  @post('/buy/:id/qr')
  @login
  async GenerateProductQrcode(ctx) {
    let product: Product = await Table.Product.where('id', ctx.params.id).first();
    if (!product) {
      throw new Error('无效的产品');
    }

    let userId = ctx.session.userId;
    let communityId = ctx.session.communityId;

    let accounts: Account[] = await Table.Account.where({communityId, userId});
    let balance = _.sumBy(accounts, a => a.balance);
    if (balance < product.points) {
      throw new Error('您的积分不足');
    }

    let code = new Qrcode(QrCodeType.OrderProduct, product.id);
    await Table.Qrcode.insert(code);

    return success(code.id);
  }

  @get('/qr/:id')
  @login
  async GetQrcode(ctx) {
    let qr: Qrcode = await Table.Qrcode.where('id', ctx.params.id).first();
    return success(qr);
  }
}
