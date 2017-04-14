import * as _ from 'lodash';

import { router, get, post, success, Response, ResponseError, login } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody, errorPage, successPage } from '../utils';
import { Account, Product, Service, Qrcode, QrcodeAction, ServiceCategories, Order } from '../models';
import { Wechat } from '../wechat';
import { Config } from '../config';
import { QrcodeConfirm } from './qrcode';

@router('/qr')
export class QrcodeController {
  /**
   * 买家生成二维码
   * @param ctx
   */
  @post('/g/product/:id')
  @login
  async BuyByQr(ctx) {
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

    let code = new Qrcode(communityId, QrcodeAction.OrderProduct, {
      buyerId: userId,
      product,
    });
    await Table.Qrcode.insert(code);

    return success(code.id);
  }

  /**
   * 生成订单二维码
   */
  @post('/g/order/:id')
  @login
  async OrderQr(ctx) {
    let order: Order = await Table.Order.where('id', ctx.params.id).first();
    if (!order) {
      throw new Error('无效的订单');
    }

    if (order.status === 'done') {
      throw new Error('该订单已完成线下结算，不可重复进行此操作');
    }

    if (order.status !== 'payed') {
      throw new Error('该订单的状态，不可进行线下结算操作');
    }

    let userId = ctx.session.userId;
    let communityId = ctx.session.communityId;

    // let accounts: Account[] = await Table.Account.where({communityId, userId});
    // let balance = _.sumBy(accounts, a => a.balance);
    // if (balance < order.amount) {
    //   throw new Error('您的积分不足');
    // }

    let code = new Qrcode(communityId, QrcodeAction.OrderProduct, {
      buyerId: userId,
      order,
    });
    await Table.Qrcode.insert(code);

    return success(code.id);
  }

  /**
   * 生成活动签到二维码
   */
  @post('/g/activity/:id')
  @login
  async ActivityQr(ctx) {
    let userId = ctx.session.userId;
    let communityId = ctx.session.communityId;

    let activity = await Table.SociallyActivity.where('id', ctx.params.id).first();
    if (!activity) {
      throw new Error('无此活动');
    }
    if (activity.status !== 2) {
      throw new Error('该活动不可进行该操作');
    }

    let code = new Qrcode(communityId, QrcodeAction.ActivityCheck, {
      activity,
    });
    await Table.Qrcode.insert(code);
    return success(code.id);
  }

  @post('/g/service/:id')
  @login
  async GenerateServiceQr(ctx) {
    let service: Service = await Table.Service.where('id', ctx.params.id).first();
    if (!service) {
      throw new Error('无效的活动');
    }

    let userId = ctx.session.userId;
    let communityId = ctx.session.communityId;

    let action = QrcodeAction.OrderHelp;

    switch (service.categoryId) {
      case ServiceCategories.Help:
        action = QrcodeAction.OrderHelp;
        break;
      case ServiceCategories.Custom:
        action = QrcodeAction.OrderCustom;
        break;
      case ServiceCategories.Public:
        action = QrcodeAction.OrderPublic;
        break;
    }

    if (action !== QrcodeAction.OrderCustom) {
      let accounts: Account[] = await Table.Account.where({communityId, userId});
      let balance = _.sumBy(accounts, a => a.balance);
      if (balance < service.points) {
        throw new Error('您的积分不足');
      }
    }

    let code = new Qrcode(communityId, action, {
      scanedId: userId,
      serviceId: service.id,
    });
    await Table.Qrcode.insert(code);

    return success(code.id);
  }

  /**
   * 扫描二维码后的跳转链接, 微信入口
   * @param ctx
   */
  @get('/scan/:id')
  async ScanQr(ctx) {
    let qr: Qrcode = await Table.Qrcode.where('id', ctx.params.id).first();
    let wechat = await Wechat.create(qr.communityId);
    let config = await Config.instance();
    let url = wechat.redirectUrl(config.hostUrl(`/qr/confirm/${ctx.params.id}`));
    ctx.redirect(url);
  }

  /**
   * 二维码的确认操作， 有扫描二维码的人员完成
   * @param ctx
   */
  @get('/confirm/:id')
  async SellByQr(ctx) {
    let qrcode: Qrcode = await Table.Qrcode.where('id', ctx.params.id).first();
    if (!qrcode || new Date() > new Date(qrcode.expiresIn) || qrcode.status !== 'submit') {
      await errorPage(ctx,  '二维码已失效');
      return;
    }
    let wechat = await Wechat.create(qrcode.communityId);
    let user = await wechat.login(ctx);
    let confirm = new QrcodeConfirm();
    try {
      let order = await confirm[qrcode.action](qrcode, user.userId);
      await successPage(ctx, '交易成功', order);
    } catch (err) {
      await errorPage(ctx, err.message);
    }
  }

  /**
   * 获取二维码信息
   */
  @get('/get/:id')
  @login
  async GetQrcode(ctx) {
    let qr: Qrcode = await Table.Qrcode.where('id', ctx.params.id).first();
    return success(qr);
  }
}
