import * as _ from 'lodash';
import * as ejs from 'ejs';

import { router, get, post, all, success, Response, ResponseError, login, wechat } from '../routes';
import { Table, db, raw, first } from '../db';
import { create, getJsonBody, validate, FieldRule, validPoints } from '../utils';
import { Service, ServiceUser, Order, OrderType, OrderStatus, OrderDetail, ServiceCategories, Question, Answer, AnswerSession } from '../models';
import { refundOrder, deductPoints, TransactionType, PayAnswer, getAnswerPay, getUserBalance, confirmAnswerSession, payAnswer } from '../account';

import { searchQuestion, getQuestion, getAnswer } from './service';

const rules = {
  question: [
    { mainTypeId: { strategy: ['required'], error: '请选择大类' } },
    { typeId: { strategy: ['required'], error: '请选择小类' } },
    { points: { strategy: ['required'], error: '请填写悬赏积分' } },
    { points: { strategy: ['isInteger'], error: '积分必须为整数' } },
    { title: { strategy: ['required'], error: '请填写内容' } },
  ],
  help: [
    { mainTypeId: { strategy: ['required'], error: '请选择大类' } },
    { typeId: { strategy: ['required'], error: '请选择小类' } },
    { title: { strategy: ['required'], error: '请填写求助内容' } },
  ],
  service: [
    { mainTypeId: { strategy: ['required'], error: '请选择大类' } },
    { typeId: { strategy: ['required'], error: '请选择小类' } },
    { title: { strategy: ['required'], error: '请填写提供服务的内容' } },
  ]
};

const questionRules: FieldRule[] = [
  { mainTypeId: { strategy: ['required'], error: '请选择大类' } },
  { typeId: { strategy: ['required'], error: '请选择小类' } },
  { points: { strategy: ['required'], error: '请填写悬赏积分' } },
  { points: { strategy: ['isInteger'], error: '积分必须为整数' } },
  { title: { strategy: ['required'], error: '请填写内容' } },
];

const answerRules: FieldRule[] = [
  { content: { strategy: ['required'], error: '请填写内容' } },
  { points: { strategy: ['isInteger'], error: '积分须为整数' } },
];

const payAnswerRules: FieldRule[] = [
  { points: { strategy: ['required'], error: '请填写悬赏积分' } },
  { points: { strategy: ['isInteger'], error: '积分必须为整数' } },
];

const helpRules: FieldRule[] = [
  { mainTypeId: { strategy: ['required'], error: '请选择大类' } },
  { typeId: { strategy: ['required'], error: '请选择小类' } },
  { title: { strategy: ['required'], error: '请填写求助内容' } },
];

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
    return success(ret);
  }


  /**
   * online=1     代表线上问答
   * online=0     代表非线上回答
   * online=其他   所有
   */
  @get('/types/:online')
  @wechat
  async types(ctx) {

    let sql = `
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
    where m1.accountid = ? and (m1.parentMenuId = '' or m1.parentMenuId is null) and
    <% if(params.online === '1') { %>
      m1.ifonline = 1
    <% } else if(params.online === '0') { %>
      m1.ifonline = 0
    <% } else { %>
      1 = 1
    <% } %>
    order by m1.seq
    `;
    sql = ejs.render(sql, ctx);
    let ret: any[] = await raw(sql, [ctx.session.communityId]);
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

    let ret = await raw(sql, [communityId, userId, ServiceCategories.Service]);

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
    let userId = ctx.session.userId;

    let types = [];
    if (ctx.query.typeId) {
      types = await raw('select id from weixin_bank_menu where parentMenuId = ?', [ctx.query.typeId]);
      types = types.map((v) => v.id);
      types.push(ctx.query.typeId);
    }


    let sql = `
      select
        s.*, t.name as mainType, t1.name as type, wu.realname, wu.headimgurl,
        <% if (query.needSessions) { %>
        (
          select
            concat(
              '[',
              group_concat(
                json_object(
                  'id', ans.id,
                  'answerId', ans.answerId,
                  'content', ans.content,
                  'type', ans.type,
                  'realname', wu1.realname,
                  'updatedAt', ans.updatedAt
                )
              ),
              ']'
            )
          from t_answer_session as ans
          join t_answer as a1 on ans.answerId = a1.id
          join t_wechat_user as wu1 on wu1.officialAccountId = ans.communityId and wu1.userId = ans.userId
          where a1.questionId = s.id
          order by ans.updatedAt
          limit 5
        ) as sessions,
        <% } %>
        (SELECT count(*) FROM t_answer AS a WHERE a.questionId = s.id) AS answerCount
      from t_question as s
      join t_service_category as c on s.category = c.id
      join weixin_bank_menu as t on s.mainTypeId = t.id
      join weixin_bank_menu as t1 on s.typeId = t1.id
      join t_wechat_user as wu on wu.officialAccountId = s.communityId and wu.userId = s.userId
      where
        s.communityId = :communityId and s.status in ('online', 'done') and
        <% if (query.isMine) { %> s.userId = :userId <% } else { %> 1 = 1 <% } %> and
        <% if (query.categoryId) { %> s.category = :categoryId <% } else { %> 1 = 1 <% } %> and
        <% if (query.typeId) { %> s.typeId in (:types)  <% } else { %> 1 = 1 <% } %>
      <% if(query.sort === 'points') { %>
      order by s.points asc
      <% } else { %>
      order by s.latestAnswerTime desc
      <% } %>
    `;

    sql = ejs.render(sql, ctx);

    let ret;

    await db.transaction(async (trx) => {
      await raw('SET SESSION group_concat_max_len = 1000000', [], trx);
      ret = await raw(sql, Object.assign({communityId, types, userId}, ctx.query), trx);
    });

    return success(ret);
  }

  @get('/search/my/answer')
  @login
  async searchAnswers(ctx) {
    const communityId = ctx.session.communityId;
    const userId = ctx.session.userId;

    let sql = `
      select
        s.*, t.name as mainType, t1.name as type, wu.realname, wu.headimgurl,
        a.content as answerContent, a.createdAt as answerTime, a.points as answerPoints, a.status as answerStatus,
        a.memo as answerMemo, a.memoTime as answerMemoTime,
        a.orderId, a.id as answerId
      from t_question as s
      join t_answer as a on s.id = a.questionId
      join t_service_category as c on s.category = c.id
      join weixin_bank_menu as t on s.mainTypeId = t.id
      join weixin_bank_menu as t1 on s.typeId = t1.id
      join t_wechat_user as wu on wu.officialAccountId = s.communityId and wu.userId = s.userId
      where
        s.communityId = :communityId and a.userId = :userId and
        <% if (query.categoryId) { %> s.category = :categoryId <% } else { %> 1 = 1 <% } %>
      order by a.updatedAt desc
    `;

    sql = ejs.render(sql, ctx);

    let ret = await raw(sql, Object.assign({communityId, userId}, ctx.query));

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
    service.points = validPoints(model.points);

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

  @get('/question/search')
  @wechat
  async searchQuestion(ctx) {
    const ret = await searchQuestion(ctx.query, ctx.session.communityId);
    return success(ret);
  }

  @get('/question/item/:id')
  @wechat
  async getQuestion(ctx) {
    const ret = await getQuestion(ctx.params.id);
    ret.currentUserId = ctx.session.userId;
    return success(ret);
  }

  @post('/:type/add')
  @login
  async addQuestion(ctx) {
    const type = ctx.params.type;
    const model = await getJsonBody(ctx);
    let r = rules[type];
    if (!r) {
      throw new Error('无效的服务种类');
    }
    validate(model, r);
    model.points = validPoints(model.points);

    let q = create(Question, model);
    q.communityId = ctx.session.communityId;
    q.userId = ctx.session.userId;
    q.category = type;

    if (type === 'question') {
      await db.transaction(async (trx) => {
        const order = await PayAnswer(trx, q);
        q.orderId = order.id;
        await Table.Question.transacting(trx).insert(q);
      });
    } else {
      await Table.Question.insert(q);
    }

    return success();
  }

  @get('/answer/:id')
  @wechat
  async getAnswerQuestion(ctx) {
    const answerId = ctx.params.id;
    let answer = await first(`
    select a.*, wu.realname from t_answer as a
    join t_wechat_user as wu on wu.officialAccountId=a.communityId and wu.userId=a.userId
    where a.id=:answerId
    `, { answerId });
    if (!answer) {
      throw new Error('无效的回答');
    }

    let question = await first(`
    select q.*, wu.realname, wu.headimgurl, t.name as mainType, t1.name as type
    from t_question as q
    join t_wechat_user as wu on wu.officialAccountId=q.communityId and wu.userId=q.userId
    join weixin_bank_menu as t on q.mainTypeId = t.id
    join weixin_bank_menu as t1 on q.typeId = t1.id
    where q.id=:questionId
    `, { questionId: answer.questionId });

    let userId = ctx.session.userId;
    let communityId = ctx.session.communityId;
    let balance = await getUserBalance(communityId, userId);

    return success({
      answer,
      question,
      balance,
      currentUserId: ctx.session.userId,
    });
  }

  @post('/answer/:id/pay')
  @login
  async getAnswerPay(ctx) {
    const model = await getJsonBody(ctx);
    validate(model, payAnswerRules);

    model.points = validPoints(model.points);

    await db.transaction(async (trx) => {
      await getAnswerPay(trx, ctx.params.id, model.points, ctx.session.userId);
    });
    return success();
  }

  @post('/answer/:id/bid')
  @login
  async payAnswer(ctx) {
    await db.transaction(async (trx) => {
      await payAnswer(trx, ctx.params.id, ctx.session.userId);
    });
    return success();
  }

  @post('/answer/session/:id/confirm')
  @login
  async confirmAnswerSession(ctx) {
    await db.transaction(async (trx) => {
      await confirmAnswerSession(trx, ctx.params.id, ctx.session.userId);
    });
    return success();
  }

  @get('/question/:id/answer')
  @wechat
  async getAnswer(ctx) {
    let userId = ctx.query.userId || ctx.session.userId;
    let answerId = ctx.query.answerId;
    let questionId = ctx.params.id;
    let answer = null;

    if (!answerId && !userId) {
      throw new ResponseError('请先登录系统', '10004');
    }
    let question = await first(`
      select a.*, wu.realname from t_question as a
      join t_wechat_user as wu on wu.officialAccountId=a.communityId and wu.userId=a.userId
      where a.id=:questionId
      `, { questionId });
    if (!question) {
      throw new Error('无效的问题');
    }

    if (answerId) {
      answer = await first(`
      select a.*, wu.realname from t_answer as a
      join t_wechat_user as wu on wu.officialAccountId=a.communityId and wu.userId=a.userId
      where a.id=:answerId
      `, { answerId });
    } else {
      if (question.category === 'question') {
        answer = await first(`
        select a.*, wu.realname from t_answer as a
        join t_wechat_user as wu on wu.officialAccountId=a.communityId and wu.userId=a.userId
        where a.questionId=:questionId and a.userId=:userId
        `, {questionId, userId});
      } else if (['help', 'service'].indexOf(question.category) !== -1) {
        answer = await first(`
        select a.*, wu.realname from t_answer as a
        join t_wechat_user as wu on wu.officialAccountId=a.communityId and wu.userId=a.userId
        where a.questionId=:questionId and a.userId=:userId and a.orderId is null
        `, {questionId, userId});
      }
    }
    let answers = await getAnswer(questionId, userId, question.category, answer);

    let currentUserId = ctx.session.userId;
    let communityId = ctx.session.communityId;
    let balance = await getUserBalance(communityId, currentUserId);

    return success({
      userId: currentUserId,
      answers,
      answer,
      question,
      balance,
    });
  }

  @post('/question/:id/answer/add')
  @login
  async addAnswer(ctx) {
    let model = await getJsonBody(ctx);
    validate(model, answerRules);

    const questionId = ctx.params.id;
    const communityId = ctx.session.communityId;
    const userId = ctx.session.userId;

    let question: Question = await Table.Question.where('id', questionId).first();
    if (!question) {
      throw new Error('无效的问题');
    }

    if (question.userId === userId) {
      throw new Error('不能回答自己的问题');
    }

    if (question.category === 'help') {
      model.points = validPoints(model.content);
      if (model.points <= 0) {
        throw new Error('积分必须大于1');
      }
    }

    if (question.category === 'service') {
      model.points = question.points;
    }

    let answer = new Answer();
    answer.communityId = communityId;
    answer.userId = userId;
    answer.questionId = questionId;
    answer.points = model.points || 0;
    answer.content = model.content;

    if (question.category === 'help') {
      await db.transaction(async (trx) => {
        let a = Table.Answer.transacting(trx).forUpdate().where('questionId', question.id).first();
        if (a) {
          throw new Error('不可重复申请');
        }
        await Table.Answer.transacting(trx).insert(a);
      });
    } else {
      await Table.Answer.insert(answer);
    }

    return success(answer);
  }

  @post('/answer/:id/edit')
  @login
  async editAnswer(ctx) {
    let model = await getJsonBody(ctx);
    validate(model, answerRules);

    model.points = validPoints(model.points);

    let answer = await Table.Answer.where('id', ctx.params.id).first();
    if (!answer) {
      throw new Error('无效的回答');
    }

    if (answer.status !== 'submit') {
      throw new Error('不可编辑');
    }

    let question = await Table.Question.where('id', answer.questionId).first();

    if (['help', 'service'].indexOf(question.category) === -1) {
      throw new Error('不可编辑的类型');
    }

    if (answer.status !== 'submit' || question.status !== 'online') {
      throw new Error('不可编辑');
    }

    let data: any = { points: model.points };

    if (question.category === 'service') {
      data.memo = model.content;
    } else {
      data.content = model.content;
    }

    await Table.Answer.where('id', answer.id).update(data);
    await Table.Question.where('id', answer.questionId).update({
      updatedAt: new Date(),
    });

    return success();
  }

  @post('/answer/:id/reject')
  @login
  async rejectAnswer(ctx) {
    let answer = await Table.Answer.where('id', ctx.params.id).first();
    if (!answer) {
      throw new Error('无效的回答');
    }

    let question = await Table.Question.where('id', answer.questionId).first();

    if (['help', 'service'].indexOf(question.category) === -1) {
      throw new Error('不可编辑的类型');
    }

    await Table.Answer.where('id', answer.id).update({
      status: 'reject',
    });
    await Table.Question.where('id', answer.questionId).update({
      updatedAt: new Date(),
    });
  }
}
