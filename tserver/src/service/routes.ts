import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, db, raw, first } from '../db';
import { create, getJsonBody } from '../utils';
import { Service, ServiceUser, Order, OrderType, OrderStatus, OrderDetail, ServiceCategories } from '../models';
import { refundOrder, deductPoints, TransactionType } from '../account';

@router('/service')
export class ServiceController {
  @get('/categories')
  @wechat
  async categories(ctx) {
    let ret = await Table.ServiceCategory.orderBy('sort');
    return success(ret);
  }

  @get('/category/:id')
  @wechat
  async category(ctx) {
   let ret = await Table.ServiceCategory.where('id', ctx.params.id).first();
    // let ret: any[] = await raw(`
    // select
    //   id as key, name as value, (
    //     select
    //       concat(
    //         '[',
    //         group_concat(json_object('key', id, 'value', name)),
    //         ']'
    //       )
    //     from weixin_bank_menu as m2 where m2.parentMenuId=m1.id
    //     order by m2.seq
    //   ) as children
    // from weixin_bank_menu as m1
    // where m1.accountid = ? and (m1.parentMenuId = '' or m1.parentMenuId is null)
    // order by m1.seq
    // `, [ctx.session.communityId]);
    return success(ret);
  }

  @get('/types/:id')
  @wechat
  async types(ctx) {
    let ret: any[] = await raw(`
    select
      id as \`key\`, name as \`value\`, (
        select
          concat(
            '[',
            group_concat(json_object('key', id, 'value', name)),
            ']'
          )
        from weixin_bank_menu as m2 where m2.parentMenuId=m1.id
        order by m2.seq
      ) as children
    from weixin_bank_menu as m1
    where m1.accountid = ? and (m1.parentMenuId = '' or m1.parentMenuId is null)
    order by m1.seq
    `, [ctx.session.communityId]);

    return success(ret);
  }

  @get('/list')
  @login
  async list(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;

    let sql = `
    select
      s.*,
      (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='submit') as submitCount,
      (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='accept') as acceptCount,
      (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='done') as doneCount,
      c.name as categoryName, t.image_href as typeIcon, t.name as typeName, t1.name as childTypeName, wu.realname as userName
    from t_service as s
    join t_service_category as c on s.categoryId = c.id
    join weixin_bank_menu as t on s.mainTypeId = t.id
    join weixin_bank_menu as t1 on s.typeId = t1.id
    join t_wechat_user as wu on wu.officialAccountId = s.communityId and wu.userId = s.userId
    where s.communityId = ? and s.userId = ? and s.categoryId = ?
    `;

    let ret = await raw(sql, [communityId, userId, ServiceCategories.Custom]);

    return success(ret);
  }

  @get('/list/help')
  @login
  async listHelp(ctx) {
    let communityId = ctx.session.communityId;
    let userId = ctx.session.userId;

    let sql = `
    select
      s.*,
      (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='submit') as submitCount,
      (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='accept') as acceptCount,
      (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='done') as doneCount,
      c.name as categoryName, t.image_href as typeIcon, t.name as typeName, t1.name as childTypeName, wu.realname as userName
    from t_service as s
    join t_service_category as c on s.categoryId = c.id
    join weixin_bank_menu as t on s.mainTypeId = t.id
    join weixin_bank_menu as t1 on s.typeId = t1.id
    join t_wechat_user as wu on wu.officialAccountId = s.communityId and wu.userId = s.userId
    where s.communityId = ? and s.userId = ? and s.categoryId = ?
    `;

    let ret = await raw(sql, [communityId, userId, ServiceCategories.Help]);

    return success(ret);
  }

  @get('/search')
  @wechat
  async search(ctx) {
    let communityId = ctx.session.communityId;

    let types = [];
    if (ctx.query.typeId) {
      types = await raw('select id from weixin_bank_menu where parentMenuId = ?', [ctx.query.typeId]);
      types = types.map((v) => v.id);
      types.push(ctx.query.typeId);
    }

    let sql = `
      select s.*, c.name as categoryName, t.image_href as typeIcon, t1.name as childTypeName, wu.realname as userName from t_service as s
      join t_service_category as c on s.categoryId = c.id
      join weixin_bank_menu as t on s.mainTypeId = t.id
      join weixin_bank_menu as t1 on s.typeId = t1.id
      join t_wechat_user as wu on wu.officialAccountId = s.communityId and wu.userId = s.userId
      where
        s.communityId = :communityId and s.status = 'normal' and
        <% if (query.categoryId) { %> s.categoryId = :categoryId <% } else { %> 1 = 1 <% } %> and
        <% if (query.typeId) { %> s.typeId in (:types)  <% } else { %> 1 = 1 <% } %>
      <% if(query.sort === 'points') { %>
      order by s.points asc
      <% } else { %>
      order by s.updatedAt desc
      <% } %>
    `;

    sql = ejs.render(sql, ctx);

    let ret = await raw(sql, Object.assign({communityId: communityId, types}, ctx.query));

    return success(ret);
  }

  @get('/item/:id')
  @wechat
  async item(ctx) {
    let serviceId = ctx.params.id;
    let sql = `
      select
        s.*, c.name as categoryName, c.fields, t.name as typeName, wu.realname as userName,
        (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='submit') as submitCount,
        (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='accept') as acceptCount,
        (select count(*) from t_service_user as su1 where s.id=su1.serviceId and status='done') as doneCount
      from t_service as s
      join t_service_category as c on s.categoryId = c.id
      join weixin_bank_menu as t on s.typeId = t.id
      join t_wechat_user as wu on wu.officialAccountId=s.communityId and wu.userId=s.userId
      where
        s.id = ?
      order by s.updatedAt desc
    `;

    let service = await first(sql, [serviceId]);

    let userId = ctx.session.userId;
    if (!userId) {
      return success({
        service,
      });
    }

    // 已注册用户

    sql = `
    select su.* from t_service_user as su
    join t_service as s on su.serviceId = s.id
    where s.id = ? and su.userId = ?
    order by su.updatedAt desc
    limit 1
    `;

    let user = await first(sql, [serviceId, userId]);

    return success({
      service,
      user,
    });
  }

  @post('/add/:id')
  @login
  async add(ctx) {
    let model = await getJsonBody(ctx);

    let category = await Table.ServiceCategory.where('id', ctx.params.id).first();
    if (!category) {
      throw new ResponseError('非法类型');
    }

    if (!model.type) {
      throw new ResponseError('请选择类型');
    }

    if (!model.childType) {
      throw new ResponseError('请选择子类型');
    }

    let type = await first(`
    select
      *
    from weixin_bank_menu as m1
    join weixin_bank_menu as m2 on m2.parentMenuId = m1.id
    where (m1.parentMenuId is null or m1.parentMenuId = '') and m1.id = ? and m2.id = ?
    `, [model.type, model.childType]);

    if (!type) {
      throw new ResponseError('子类型和主类型不匹配， 请重新选择');
    }

    let service = new Service();
    service.categoryId = category.id;
    service.communityId = ctx.session.communityId;
    service.userId = ctx.session.userId;
    service.content = JSON.stringify(model);
    service.mainTypeId = model.type;
    service.typeId = model.childType;
    service.points = model.points;

    await Table.Service.insert(service);

    return success();
  }

  @get('/:id/users/:status')
  @login
  async users(ctx) {
    let sql = `
    select su.*, wu.realname  from t_service_user as su
    join t_wechat_user as wu on su.communityId = wu.officialAccountId and su.userId = wu.userId
    where su.serviceId = ? and su.status = ?
    order by su.updatedAt desc
    `;

    let ret = await raw(sql, [ctx.params.id, ctx.params.status]);

    return success(ret);
  }

  @post('/:id/join')
  @login
  async join(ctx) {
    let model = await getJsonBody(ctx);

    let entity = create(ServiceUser, model);
    entity.serviceId = ctx.params.id;
    entity.communityId = ctx.session.communityId;
    entity.userId = ctx.session.userId;
    entity.status = 'submit';

    await db.transaction(async (trx) => {
      // 检查用户是否已经参加
      let user = await Table.ServiceUser.transacting(trx).where({
        serviceId: ctx.params.id,
        communityId: ctx.session.communityId,
        userId: ctx.session.userId,
      }).orderBy('updatedAt', 'desc').forUpdate().first();

      if (!user || ['reject', 'quit'].indexOf(user.status) !== -1) {
        // 可以添加报名记录
        await Table.ServiceUser.transacting(trx).insert(entity);
      } else {
        throw new Error(`不可重复添加报名记录`);
      }
    });
    return success();
  }

  @post('/:id/quit')
  @login
  async quit(ctx) {
    let id = ctx.params.id;

    await db.transaction(async (trx) => {
      let user = await Table.ServiceUser.transacting(trx).forUpdate().where('id', id).first();
      if (user && ['submit'].indexOf(user.status) !== -1) {
        await Table.ServiceUser.transacting(trx).where('id', id).update({
          status: 'quit',
        });
        if (user.orderId) {
          refundOrder(trx, user.orderId);
        }
      } else {
        throw new Error(`不可退出`);
      }
    });

    return success();
  }

  @post('/:id/reject')
  @login
  async reject(ctx) {
    let serviceId = ctx.params.id;

    let ids: string[] = await getJsonBody(ctx);
    if (!ids || !ids.length) {
      return success();
    }

    await db.transaction(async (trx) => {
      let service: Service = await Table.Service.transacting(trx).forUpdate().where('id', serviceId).first();
      if (!service || service.status === 'closed') {
        throw new Error('服务不存在或服务已关闭');
      }

      for (let id of ids) {
        let user: ServiceUser = await Table.ServiceUser.transacting(trx).forUpdate().where('id', id).first();
        if (!user || user.status !== 'submit') {
          throw new Error('所选的用户并未参与，或状态不对, 请重新选择');
        }

        if (user.serviceId !== serviceId) {
          throw new Error('所选报价与服务不匹配');
        }

        if (user.orderId) {
          refundOrder(trx, user.orderId);
        }
      }

      await Table.ServiceUser.transacting(trx).whereIn('id', ids).update({
        status: 'reject',
      });

    });

    return success();
  }


  @post('/:id/accept')
  @login
  async accept(ctx) {
    let serviceId = ctx.params.id;

    let ids: string[] = await getJsonBody(ctx);
    if (!ids || !ids.length) {
      return success();
    }

    await db.transaction(async (trx) => {
      let service: Service = await Table.Service.transacting(trx).forUpdate().where('id', serviceId).first();
      if (!service || service.status === 'closed') {
        throw new Error('服务不存在或服务已关闭');
      }

      for (let id of ids) {
        let user: ServiceUser = await Table.ServiceUser.transacting(trx).forUpdate().where('id', id).first();
        if (!user || user.status !== 'submit') {
          throw new Error('所选的用户并未参与，或状态不对, 请重新选择');
        }

        if (user.serviceId !== serviceId) {
          throw new Error('所选报价与服务不匹配');
        }

        let order = new Order();
        order.type = OrderType.Service;
        order.communityId = service.communityId;
        order.sellerId = service.categoryId === ServiceCategories.Custom ? service.userId : user.userId;
        order.buyerId = service.categoryId === ServiceCategories.Custom ? user.userId : service.userId;
        order.status = OrderStatus.Payed;
        order.amount = user.points;
        order.orderTime = order.payTime = new Date();

        let detail = new OrderDetail();
        detail.orderId = order.id;
        detail.type = OrderType.Service;
        detail.productId = user.id;
        detail.data = JSON.stringify(service);
        detail.points = user.points;

        order.buyerTradeTransactionId = await deductPoints(
          trx, service.communityId, order.buyerId, TransactionType.PayService, order.amount
        );

        await Table.Order.transacting(trx).insert(order);
        await Table.OrderDetail.transacting(trx).insert(detail);
        await Table.ServiceUser.transacting(trx).where('id', id).update({
          payedPoints: user.points,
          orderId: order.id,
          status: 'accept',
        });
      }

    });

    return success();
  }
}
