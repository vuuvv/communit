import { Table, db } from '../db';
import { Qrcode, Order, OrderType, OrderStatus, OrderDetail, Product, QrcodeAction, Service } from '../models';
import { addPoints, deductPoints, AccountType, TransactionType } from '../account';

export interface OrderProductConfirm {
  buyerId: string;
  productId: string;
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
    if (!data.buyerId || !data.productId || !confirmerId) {
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

    let order = new Order();
    order.type = OrderType.Product;
    order.communityId = qrcode.communityId;
    order.sellerId = seller.userId;
    order.buyerId = buyer.userId;
    order.orderTime = order.payTime = order.tradeTime = new Date();

    let detail = new OrderDetail();
    detail.orderId = order.id;
    detail.type = OrderType.Product;
    detail.productId = data.productId;

    let ret = '';
    await db.transaction(async (trx) => {
      qrcode = await Table.Qrcode.transacting(trx).where('id', qrcode.id).forUpdate().first();
      if (!qrcode || new Date() > new Date(qrcode.expiresIn) || qrcode.status !== 'submit') {
        throw new Error('二维码已失效');
      }

      let product: Product = await Table.Product.transacting(trx).where('id', data.productId).first();
      if (!product) {
        throw new Error('无效的产品');
      }
      // TODO: 检查商品状态


      let amount = order.amount = product.points;

      order.buyerTradeTransactionId = await deductPoints(
        trx, qrcode.communityId, buyer.userId, TransactionType.PayProduct, amount
      );
      order.sellerTradeTransactionId = await addPoints(
        trx, qrcode.communityId, seller.userId, AccountType.Normal, TransactionType.GetProduct, amount
      );

      order.status = OrderStatus.Done;

      await Table.Order.transacting(trx).insert(order);

      detail.points = amount;
      detail.data = JSON.stringify(product);

      await Table.OrderDetail.transacting(trx).insert(detail);

      await Table.Qrcode.transacting(trx).where('id', qrcode.id).update({
        status: 'done',
      });

      ret = `${product.title} 交易金额: ${order.amount}积分`;
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
