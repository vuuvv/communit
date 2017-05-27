"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const ejs = require("ejs");
const routes_1 = require("../routes");
const db_1 = require("../db");
const utils_1 = require("../utils");
const models_1 = require("../models");
const account_1 = require("../account");
const service_1 = require("./service");
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
const questionRules = [
    { mainTypeId: { strategy: ['required'], error: '请选择大类' } },
    { typeId: { strategy: ['required'], error: '请选择小类' } },
    { points: { strategy: ['required'], error: '请填写悬赏积分' } },
    { points: { strategy: ['isInteger'], error: '积分必须为整数' } },
    { title: { strategy: ['required'], error: '请填写内容' } },
];
const answerRules = [
    { content: { strategy: ['required'], error: '请填写内容' } },
    { points: { strategy: ['isInteger'], error: '积分须为整数' } },
];
const payAnswerRules = [
    { points: { strategy: ['required'], error: '请填写悬赏积分' } },
    { points: { strategy: ['isInteger'], error: '积分必须为整数' } },
];
const helpRules = [
    { mainTypeId: { strategy: ['required'], error: '请选择大类' } },
    { typeId: { strategy: ['required'], error: '请选择小类' } },
    { title: { strategy: ['required'], error: '请填写求助内容' } },
];
let ServiceController = class ServiceController {
    async categories(ctx) {
        let ret = await db_1.Table.ServiceCategory.orderBy('sort');
        return routes_1.success(ret);
    }
    async category(ctx) {
        let ret = await db_1.Table.ServiceCategory.where('id', ctx.params.id).first();
        return routes_1.success(ret);
    }
    /**
     * online=1     代表线上问答
     * online=0     代表非线上回答
     * online=其他   所有
     */
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
        let ret = await db_1.raw(sql, [ctx.session.communityId]);
        return routes_1.success(ret);
    }
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
        let ret = await db_1.raw(sql, [communityId, userId, models_1.ServiceCategories.Service]);
        return routes_1.success(ret);
    }
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
        let ret = await db_1.raw(sql, [communityId, userId, models_1.ServiceCategories.Help]);
        return routes_1.success(ret);
    }
    async search(ctx) {
        let communityId = ctx.session.communityId;
        let userId = ctx.session.userId;
        let types = [];
        if (ctx.query.typeId) {
            types = await db_1.raw('select id from weixin_bank_menu where parentMenuId = ?', [ctx.query.typeId]);
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
        await db_1.db.transaction(async (trx) => {
            await db_1.raw('SET SESSION group_concat_max_len = 1000000', [], trx);
            ret = await db_1.raw(sql, Object.assign({ communityId, types, userId }, ctx.query), trx);
        });
        return routes_1.success(ret);
    }
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
        let ret = await db_1.raw(sql, Object.assign({ communityId, userId }, ctx.query));
        return routes_1.success(ret);
    }
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
        let service = await db_1.first(sql, [serviceId]);
        let userId = ctx.session.userId;
        if (!userId) {
            return routes_1.success({
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
        let user = await db_1.first(sql, [serviceId, userId]);
        return routes_1.success({
            service,
            user,
        });
    }
    async add(ctx) {
        let model = await utils_1.getJsonBody(ctx);
        let category = await db_1.Table.ServiceCategory.where('id', ctx.params.id).first();
        if (!category) {
            throw new routes_1.ResponseError('非法类型');
        }
        if (!model.type) {
            throw new routes_1.ResponseError('请选择类型');
        }
        if (!model.childType) {
            throw new routes_1.ResponseError('请选择子类型');
        }
        let type = await db_1.first(`
    select
      *
    from weixin_bank_menu as m1
    join weixin_bank_menu as m2 on m2.parentMenuId = m1.id
    where (m1.parentMenuId is null or m1.parentMenuId = '') and m1.id = ? and m2.id = ?
    `, [model.type, model.childType]);
        if (!type) {
            throw new routes_1.ResponseError('子类型和主类型不匹配， 请重新选择');
        }
        let service = new models_1.Service();
        service.categoryId = category.id;
        service.communityId = ctx.session.communityId;
        service.userId = ctx.session.userId;
        service.content = JSON.stringify(model);
        service.mainTypeId = model.type;
        service.typeId = model.childType;
        service.points = utils_1.validPoints(model.points);
        await db_1.Table.Service.insert(service);
        return routes_1.success();
    }
    async users(ctx) {
        let sql = `
    select su.*, wu.realname  from t_service_user as su
    join t_wechat_user as wu on su.communityId = wu.officialAccountId and su.userId = wu.userId
    where su.serviceId = ? and su.status = ?
    order by su.updatedAt desc
    `;
        let ret = await db_1.raw(sql, [ctx.params.id, ctx.params.status]);
        return routes_1.success(ret);
    }
    async join(ctx) {
        let model = await utils_1.getJsonBody(ctx);
        let entity = utils_1.create(models_1.ServiceUser, model);
        entity.serviceId = ctx.params.id;
        entity.communityId = ctx.session.communityId;
        entity.userId = ctx.session.userId;
        entity.status = 'submit';
        await db_1.db.transaction(async (trx) => {
            // 检查用户是否已经参加
            let user = await db_1.Table.ServiceUser.transacting(trx).where({
                serviceId: ctx.params.id,
                communityId: ctx.session.communityId,
                userId: ctx.session.userId,
            }).orderBy('updatedAt', 'desc').forUpdate().first();
            if (!user || ['reject', 'quit'].indexOf(user.status) !== -1) {
                // 可以添加报名记录
                await db_1.Table.ServiceUser.transacting(trx).insert(entity);
            }
            else {
                throw new Error(`不可重复添加报名记录`);
            }
        });
        return routes_1.success();
    }
    async quit(ctx) {
        let id = ctx.params.id;
        await db_1.db.transaction(async (trx) => {
            let user = await db_1.Table.ServiceUser.transacting(trx).forUpdate().where('id', id).first();
            if (user && ['submit'].indexOf(user.status) !== -1) {
                await db_1.Table.ServiceUser.transacting(trx).where('id', id).update({
                    status: 'quit',
                });
                if (user.orderId) {
                    account_1.refundOrder(trx, user.orderId);
                }
            }
            else {
                throw new Error(`不可退出`);
            }
        });
        return routes_1.success();
    }
    async reject(ctx) {
        let serviceId = ctx.params.id;
        let ids = await utils_1.getJsonBody(ctx);
        if (!ids || !ids.length) {
            return routes_1.success();
        }
        await db_1.db.transaction(async (trx) => {
            let service = await db_1.Table.Service.transacting(trx).forUpdate().where('id', serviceId).first();
            if (!service || service.status === 'closed') {
                throw new Error('服务不存在或服务已关闭');
            }
            for (let id of ids) {
                let user = await db_1.Table.ServiceUser.transacting(trx).forUpdate().where('id', id).first();
                if (!user || user.status !== 'submit') {
                    throw new Error('所选的用户并未参与，或状态不对, 请重新选择');
                }
                if (user.serviceId !== serviceId) {
                    throw new Error('所选报价与服务不匹配');
                }
                if (user.orderId) {
                    account_1.refundOrder(trx, user.orderId);
                }
            }
            await db_1.Table.ServiceUser.transacting(trx).whereIn('id', ids).update({
                status: 'reject',
            });
        });
        return routes_1.success();
    }
    async searchQuestion(ctx) {
        const ret = await service_1.searchQuestion(ctx.query, ctx.session.communityId);
        return routes_1.success(ret);
    }
    async getQuestion(ctx) {
        const ret = await service_1.getQuestion(ctx.params.id);
        ret.currentUserId = ctx.session.userId;
        return routes_1.success(ret);
    }
    async addQuestion(ctx) {
        const type = ctx.params.type;
        const model = await utils_1.getJsonBody(ctx);
        let r = rules[type];
        if (!r) {
            throw new Error('无效的服务种类');
        }
        utils_1.validate(model, r);
        model.points = utils_1.validPoints(model.points);
        let q = utils_1.create(models_1.Question, model);
        q.communityId = ctx.session.communityId;
        q.userId = ctx.session.userId;
        q.category = type;
        if (type === 'question') {
            await db_1.db.transaction(async (trx) => {
                const order = await account_1.PayAnswer(trx, q);
                q.orderId = order.id;
                await db_1.Table.Question.transacting(trx).insert(q);
            });
        }
        else {
            await db_1.Table.Question.insert(q);
        }
        return routes_1.success();
    }
    async getAnswerQuestion(ctx) {
        const answerId = ctx.params.id;
        let answer = await db_1.first(`
    select a.*, wu.realname from t_answer as a
    join t_wechat_user as wu on wu.officialAccountId=a.communityId and wu.userId=a.userId
    where a.id=:answerId
    `, { answerId });
        if (!answer) {
            throw new Error('无效的回答');
        }
        let question = await db_1.first(`
    select q.*, wu.realname, wu.headimgurl, t.name as mainType, t1.name as type
    from t_question as q
    join t_wechat_user as wu on wu.officialAccountId=q.communityId and wu.userId=q.userId
    join weixin_bank_menu as t on q.mainTypeId = t.id
    join weixin_bank_menu as t1 on q.typeId = t1.id
    where q.id=:questionId
    `, { questionId: answer.questionId });
        let userId = ctx.session.userId;
        let communityId = ctx.session.communityId;
        let balance = await account_1.getUserBalance(communityId, userId);
        return routes_1.success({
            answer,
            question,
            balance,
            currentUserId: ctx.session.userId,
        });
    }
    async getAnswerPay(ctx) {
        const model = await utils_1.getJsonBody(ctx);
        utils_1.validate(model, payAnswerRules);
        model.points = utils_1.validPoints(model.points);
        await db_1.db.transaction(async (trx) => {
            await account_1.getAnswerPay(trx, ctx.params.id, model.points, ctx.session.userId);
        });
        return routes_1.success();
    }
    async payAnswer(ctx) {
        await db_1.db.transaction(async (trx) => {
            await account_1.payAnswer(trx, ctx.params.id, ctx.session.userId);
        });
        return routes_1.success();
    }
    async confirmAnswerSession(ctx) {
        await db_1.db.transaction(async (trx) => {
            await account_1.confirmAnswerSession(trx, ctx.params.id, ctx.session.userId);
        });
        return routes_1.success();
    }
    async getAnswer(ctx) {
        let userId = ctx.query.userId || ctx.session.userId;
        let answerId = ctx.query.answerId;
        let questionId = ctx.params.id;
        let answer = null;
        if (!answerId && !userId) {
            throw new routes_1.ResponseError('请先登录系统', '10004');
        }
        let question = await db_1.first(`
      select a.*, wu.realname from t_question as a
      join t_wechat_user as wu on wu.officialAccountId=a.communityId and wu.userId=a.userId
      where a.id=:questionId
      `, { questionId });
        if (!question) {
            throw new Error('无效的问题');
        }
        if (answerId) {
            answer = await db_1.first(`
      select a.*, wu.realname from t_answer as a
      join t_wechat_user as wu on wu.officialAccountId=a.communityId and wu.userId=a.userId
      where a.id=:answerId
      `, { answerId });
        }
        else {
            if (question.category === 'question') {
                answer = await db_1.first(`
        select a.*, wu.realname from t_answer as a
        join t_wechat_user as wu on wu.officialAccountId=a.communityId and wu.userId=a.userId
        where a.questionId=:questionId and a.userId=:userId
        `, { questionId, userId });
            }
            else if (['help', 'service'].indexOf(question.category) !== -1) {
                answer = await db_1.first(`
        select a.*, wu.realname from t_answer as a
        join t_wechat_user as wu on wu.officialAccountId=a.communityId and wu.userId=a.userId
        where a.questionId=:questionId and a.userId=:userId and a.orderId is null
        `, { questionId, userId });
            }
        }
        let answers = await service_1.getAnswer(questionId, userId, question.category, answer);
        let currentUserId = ctx.session.userId;
        let communityId = ctx.session.communityId;
        let balance = await account_1.getUserBalance(communityId, currentUserId);
        return routes_1.success({
            userId: currentUserId,
            answers,
            answer,
            question,
            balance,
        });
    }
    async addAnswer(ctx) {
        let model = await utils_1.getJsonBody(ctx);
        utils_1.validate(model, answerRules);
        const questionId = ctx.params.id;
        const communityId = ctx.session.communityId;
        const userId = ctx.session.userId;
        let question = await db_1.Table.Question.where('id', questionId).first();
        if (!question) {
            throw new Error('无效的问题');
        }
        if (question.userId === userId) {
            throw new Error('不能回答自己的问题');
        }
        if (question.category === 'help') {
            model.points = utils_1.validPoints(model.content);
            if (model.points <= 0) {
                throw new Error('积分必须大于1');
            }
        }
        if (question.category === 'service') {
            model.points = question.points;
        }
        let answer = new models_1.Answer();
        answer.communityId = communityId;
        answer.userId = userId;
        answer.questionId = questionId;
        answer.points = model.points || 0;
        answer.content = model.content;
        if (question.category === 'help') {
            await db_1.db.transaction(async (trx) => {
                let a = db_1.Table.Answer.transacting(trx).forUpdate().where('questionId', question.id).first();
                if (a) {
                    throw new Error('不可重复申请');
                }
                await db_1.Table.Answer.transacting(trx).insert(a);
            });
        }
        else {
            await db_1.Table.Answer.insert(answer);
        }
        return routes_1.success(answer);
    }
    async editAnswer(ctx) {
        let model = await utils_1.getJsonBody(ctx);
        utils_1.validate(model, answerRules);
        model.points = utils_1.validPoints(model.points);
        let answer = await db_1.Table.Answer.where('id', ctx.params.id).first();
        if (!answer) {
            throw new Error('无效的回答');
        }
        if (answer.status !== 'submit') {
            throw new Error('不可编辑');
        }
        let question = await db_1.Table.Question.where('id', answer.questionId).first();
        if (['help', 'service'].indexOf(question.category) === -1) {
            throw new Error('不可编辑的类型');
        }
        if (answer.status !== 'submit' || question.status !== 'online') {
            throw new Error('不可编辑');
        }
        let data = { points: model.points };
        if (question.category === 'service') {
            data.memo = model.content;
        }
        else {
            data.content = model.content;
        }
        await db_1.Table.Answer.where('id', answer.id).update(data);
        await db_1.Table.Question.where('id', answer.questionId).update({
            updatedAt: new Date(),
        });
        return routes_1.success();
    }
    async rejectAnswer(ctx) {
        let answer = await db_1.Table.Answer.where('id', ctx.params.id).first();
        if (!answer) {
            throw new Error('无效的回答');
        }
        let question = await db_1.Table.Question.where('id', answer.questionId).first();
        if (['help', 'service'].indexOf(question.category) === -1) {
            throw new Error('不可编辑的类型');
        }
        await db_1.Table.Answer.where('id', answer.id).update({
            status: 'reject',
        });
        await db_1.Table.Question.where('id', answer.questionId).update({
            updatedAt: new Date(),
        });
    }
};
__decorate([
    routes_1.get('/categories'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "categories", null);
__decorate([
    routes_1.get('/category/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "category", null);
__decorate([
    routes_1.get('/types/:online'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "types", null);
__decorate([
    routes_1.get('/list'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "list", null);
__decorate([
    routes_1.get('/list/help'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "listHelp", null);
__decorate([
    routes_1.get('/search'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "search", null);
__decorate([
    routes_1.get('/search/my/answer'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "searchAnswers", null);
__decorate([
    routes_1.get('/item/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "item", null);
__decorate([
    routes_1.post('/add/:id'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "add", null);
__decorate([
    routes_1.get('/:id/users/:status'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "users", null);
__decorate([
    routes_1.post('/:id/join'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "join", null);
__decorate([
    routes_1.post('/:id/quit'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "quit", null);
__decorate([
    routes_1.post('/:id/reject'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "reject", null);
__decorate([
    routes_1.get('/question/search'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "searchQuestion", null);
__decorate([
    routes_1.get('/question/item/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "getQuestion", null);
__decorate([
    routes_1.post('/:type/add'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "addQuestion", null);
__decorate([
    routes_1.get('/answer/:id'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "getAnswerQuestion", null);
__decorate([
    routes_1.post('/answer/:id/pay'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "getAnswerPay", null);
__decorate([
    routes_1.post('/answer/:id/bid'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "payAnswer", null);
__decorate([
    routes_1.post('/answer/session/:id/confirm'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "confirmAnswerSession", null);
__decorate([
    routes_1.get('/question/:id/answer'),
    routes_1.wechat,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "getAnswer", null);
__decorate([
    routes_1.post('/question/:id/answer/add'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "addAnswer", null);
__decorate([
    routes_1.post('/answer/:id/edit'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "editAnswer", null);
__decorate([
    routes_1.post('/answer/:id/reject'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "rejectAnswer", null);
ServiceController = __decorate([
    routes_1.router('/service')
], ServiceController);
exports.ServiceController = ServiceController;
