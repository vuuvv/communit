import { Table, db } from '../db';
import { Qrcode, Order, OrderType, OrderStatus, OrderDetail, Product } from '../models';
import { addPoints, deductPoints, AccountType, TransactionType } from '../account';

export interface OrderProductConfirm {
  buyerId: string;
  productId: string;
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
    order.sellerId = seller.id;
    order.buyerId = buyer.id;
    order.orderTime = order.payTime = order.tradeTime = new Date();

    let detail = new OrderDetail();
    detail.orderId = order.id;
    detail.type = OrderType.Product;
    detail.productId = data.productId;

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

      return order;
    });
  }
}
