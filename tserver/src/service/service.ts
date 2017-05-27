import * as ejs from 'ejs';

import { Table, db, raw, first } from '../db';

export async function searchQuestion(query, communityId, start = 0, length = 20) {
  let sql = `
SELECT
	q.*, wbm1. NAME AS mainType,
	wbm2. NAME AS type,
	wu.realname,
	wu.headimgurl,
	(SELECT count(*) FROM t_answer AS a WHERE a.questionId = q.id) AS answerCount
FROM
	t_question AS q
JOIN weixin_bank_menu AS wbm1 ON wbm1.id = q.mainTypeId
JOIN weixin_bank_menu AS wbm2 ON wbm2.id = q.typeId
JOIN t_wechat_user AS wu ON wu.officialAccountId = q.communityId AND wu.userId = q.userId
WHERE
  q.communityId = :communityId and
  q.status = 'online' and
  <% if (query.category) { %>
  category = :category
  <% } else { %>
  1=1
  <% } %>
ORDER BY q.createdAt desc
  `;

  sql = ejs.render(sql, {query});

  query = Object.assign({}, query, {communityId});

  return await raw(sql, query);
}

async function getQuestionById(questionId) {
  let sql = `
SELECT
	q.*, wbm1. NAME AS mainType,
	wbm2. NAME AS type,
	wu.realname,
	wu.headimgurl,
	(SELECT count(*) FROM t_answer AS a WHERE a.questionId = q.id) AS answerCount
FROM
	t_question AS q
JOIN weixin_bank_menu AS wbm1 ON wbm1.id = q.mainTypeId
JOIN weixin_bank_menu AS wbm2 ON wbm2.id = q.typeId
JOIN t_wechat_user AS wu ON wu.officialAccountId = q.communityId AND wu.userId = q.userId
WHERE q.id = :questionId
  `;

  const question = await first(sql, {questionId});

}

export async function getQuestion(questionId) {
  let sql = `
SELECT
	q.*, wbm1. NAME AS mainType,
	wbm2. NAME AS type,
	wu.realname,
	wu.headimgurl,
	(SELECT count(*) FROM t_answer AS a WHERE a.questionId = q.id) AS answerCount
FROM
	t_question AS q
JOIN weixin_bank_menu AS wbm1 ON wbm1.id = q.mainTypeId
JOIN weixin_bank_menu AS wbm2 ON wbm2.id = q.typeId
JOIN t_wechat_user AS wu ON wu.officialAccountId = q.communityId AND wu.userId = q.userId
WHERE q.id = :questionId
  `;

  const question = await first(sql, {questionId});

  if (!question) {
    throw new Error('无效的问题');
  }

  sql = `
SELECT
	a.*,
	wu.realname,
	wu.headimgurl,
	(SELECT count(*) FROM t_answer_session AS a1 WHERE a1.answerId = a.id) AS answerCount,
	(SELECT content FROM t_answer_session AS a2 WHERE a2.answerId = a.id ORDER BY a2.createdAt ASC LIMIT 1) AS answerContent,
	(SELECT type FROM t_answer_session AS a2 WHERE a2.answerId = a.id ORDER BY a2.createdAt ASC LIMIT 1) AS answerType
FROM
	t_answer AS a
JOIN t_wechat_user AS wu ON wu.officialAccountId = a.communityId AND wu.userId = a.userId
WHERE a.questionId = :questionId
  `;

  question.answers = await raw(sql, {questionId});

  return question;
}

export async function getAnswer(questionId: string, userId: string, category: string, answer = null) {
  const answerId = answer ? answer.id : null;
  let sql = `
  SELECT * from
(
  SELECT
    q.id, q.title as content, '' as type, '' as points, q.createdAt,
    wu.userId,
    wu.realname,
    wu.headimgurl
  FROM
    t_question AS q
  JOIN t_wechat_user AS wu ON wu.officialAccountId = q.communityId AND wu.userId = q.userId
  WHERE q.id = :questionId

  UNION ALL

  SELECT
    ans.id, ans.content, ans.type, ans.points, ans.createdAt,
    wu.userId,
    wu.realname,
    wu.headimgurl
  FROM
    t_answer_session AS ans
  JOIN t_wechat_user AS wu ON wu.officialAccountId = ans.communityId AND wu.userId = ans.userId
  <% if (answerId) {%>
  WHERE ans.answerId = :answerId
  <% } else { %>
  JOIN t_answer AS a on ans.answerId=a.id
  JOIN t_question AS q on a.questionId=q.id
  WHERE q.id=:questionId and a.userId=:userId and
    <% if(['help', 'service'].indexOf(category) !== -1) { %>
      a.orderId is null
    <% } else { %>
      1=1
    <% } %>
  <% } %>
) as m
order by m.createdAt;
  `;

  // help 和 service 类型的answer，如果用question和userId查询，answer必须没有进行交易

  sql = ejs.render(sql, {answerId, category});
  return await raw(sql, {questionId, userId, answerId});
}
