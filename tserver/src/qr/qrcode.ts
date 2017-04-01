import { Table, db } from '../db';
import { Qrcode, Order, OrderType, OrderStatus, OrderDetail, Product, QrcodeAction, Service } from '../models';
import { addPoints, deductPoints, AccountType, TransactionType } from '../account';

export interface OrderProductConfirm {
  buyerId: string;
  order: Order;
}

export interface OrderServiceConfirm {
  scanedId: string;
  serviceId: string;
}

async function getWechatUser(officialAccountId, userId) {
  return await Table.WechatUser.where({officialAccountId, userId}).first();
}

export class QrcodeConfirm {
  async orderProduct(qrcode: Qrcode, confirmerId: string) {
    let data: OrderProductConfirm = JSON.parse(qrcode.data);
    if (!data.buyerId || !data.order || !confirmerId) {
      throw new Error('错误的二维码');
    }

    let buyer = await getWechatUser(qrcode.communityId, data.buyerId);
    if (!buyer) {
      throw new Error('无效的买家');
    }

    let seller = await getWechatUser(qrcode.communityId, confirmerId);
    if (!seller) {
      throw new Error('无效的卖家');
    }

    let store = await Table.Store.where({
      communityId: qrcode.communityId,
      userId: confirmerId,
    }).first();

    if (!store) {
      throw new Error('您还没有店铺， 不可售卖该产品');
    }

    if (store.status !== 'normal') {
      throw new Error('您的店铺已关闭，不可售卖产品');
    }

    let details = await Table.OrderDetail.where('orderId', data.order.id);
    for (let detail of details) {
      let product = JSON.parse(detail.data);
      if (product.storeId !== store.id) {
        throw new Error('该产品不属于您的店铺，请确认二维码上的产品信息');
      }
    }

    let ret = '';
    await db.transaction(async (trx) => {
      let order = await Table.Order.transacting(trx).where('id', data.order.id).forUpdate().first();
      if (order.status !== 'payed') {
        throw new Error(`[${order.status}]订单状态已失效，不可进行线下结算`);
      }

      qrcode = await Table.Qrcode.transacting(trx).where('id', qrcode.id).first();

      if (!qrcode || new Date() > new Date(qrcode.expiresIn) || qrcode.status !== 'submit') {
        throw new Error('二维码已失效');
      }

      let products = await Table.Product.transacting(trx).whereIn('id', details.map((v) => v.productId));
      for (let product of products) {
        if (product.status !== 'online') {
          throw new Error('产品已下线，不可售卖');
        }
      }

      // 我们把店铺和店铺所有人的账户分开, 售卖商品的时候是店铺的账户进行收款
      order.sellerTradeTransactionId = await addPoints(
        trx, qrcode.communityId, store.id, AccountType.Store, TransactionType.GetProduct, order.amount
      );

      order.status = OrderStatus.Done;

      await Table.Order.transacting(trx).insert(order);

      await Table.Qrcode.transacting(trx).where('id', qrcode.id).update({
        status: 'done',
      });

      let titles = products.map((p) => p.title).join(',');

      ret = `${titles} 交易金额: ${order.amount}积分`;
    });
    return ret;
  }

  async orderService(qrcode: Qrcode, confirmerId: string, action: string) {
    let data: OrderServiceConfirm = JSON.parse(qrcode.data);
    if (!data.scanedId || !data.serviceId || !confirmerId) {
      throw new Error('错误的二维码');
    }

    let buyer = await getWechatUser(qrcode.communityId, data.scanedId);
    if (!buyer) {
      throw new Error('无效的买家');
    }

    let seller = await getWechatUser(qrcode.communityId, confirmerId);
    if (!seller) {
      throw new Error('无效的卖家');
    }

    let order = new Order();
    order.type = OrderType.Product;
    order.communityId = qrcode.communityId;
    order.sellerId = seller.userId;
    order.buyerId = buyer.userId;
    order.orderTime = order.payTime = order.tradeTime = new Date();

    let detail = new OrderDetail();
    detail.orderId = order.id;
    detail.type = OrderType.Service;
    detail.productId = data.serviceId;

    let ret = '';
    await db.transaction(async (trx) => {
      qrcode = await Table.Qrcode.transacting(trx).where('id', qrcode.id).forUpdate().first();
      if (!qrcode || new Date() > new Date(qrcode.expiresIn) || qrcode.status !== 'submit') {
        throw new Error('二维码已失效');
      }

      let service: Service = await Table.Service.transacting(trx).where('id', data.serviceId).first();
      if (!service) {
        throw new Error('无效的产品');
      }
      // TODO: 检查商品状态

      let amount = order.amount = service.points;

      if (action === QrcodeAction.OrderHelp) {
        order.buyerTradeTransactionId = await addPoints(
          trx, qrcode.communityId, buyer.userId, AccountType.Normal, TransactionType.GetService, amount
        );
        order.sellerTradeTransactionId = await deductPoints(
          trx, qrcode.communityId, seller.userId, TransactionType.PayService, amount
        );
      } else {
        order.buyerTradeTransactionId = await deductPoints(
          trx, qrcode.communityId, buyer.userId, TransactionType.PayService, amount
        );
        order.sellerTradeTransactionId = await addPoints(
          trx, qrcode.communityId, seller.userId, AccountType.Normal, TransactionType.GetService, amount
        );
      }


      order.status = OrderStatus.Done;

      await Table.Order.transacting(trx).insert(order);

      detail.points = amount;
      detail.data = JSON.stringify(service);

      await Table.OrderDetail.transacting(trx).insert(detail);

      await Table.Qrcode.transacting(trx).where('id', qrcode.id).update({
        status: 'done',
      });

      ret = `${service.content} 交易金额: ${order.amount}积分`;
    });
    return ret;
  }

  async orderHelp(qrcode: Qrcode, confirmerId: string) {
    return await this.orderService(qrcode, confirmerId, QrcodeAction.OrderHelp);
  }

  async orderCustom(qrcode: Qrcode, confirmerId: string) {
    return await this.orderService(qrcode, confirmerId, QrcodeAction.OrderCustom);
  }

  async orderPublic(qrcode: Qrcode, confirmerId: string) {
    return await this.orderService(qrcode, confirmerId, QrcodeAction.OrderPublic);
  }
}
