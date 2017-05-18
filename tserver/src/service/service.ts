import * as ejs from 'ejs';

import { Table, db, raw, first } from '../db';

export async function searchQuestion(query, communityId, start = 0, length = 20) {
  const sql = `
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
WHERE q.communityId = :communityId
ORDER BY q.createdAt desc
  `;

  return await raw(sql, {communityId});
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
	(SELECT content FROM t_answer_session AS a2 WHERE a2.answerId = a.id ORDER BY a2.createdAt ASC LIMIT 1) AS answerContent
FROM
	t_answer AS a
JOIN t_wechat_user AS wu ON wu.officialAccountId = a.communityId AND wu.userId = a.userId
WHERE a.questionId = :questionId
  `;

  question.answers = await raw(sql, {questionId});

  return question;
}

export async function getAnswer(questionId: string, userId: string, answerId = null) {
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
  WHERE q.id=:questionId and ans.userId=:userId
  <% } %>
) as m
order by m.createdAt;
  `;

  sql = ejs.render(sql, {answerId});
  return await raw(sql, {questionId, userId, answerId});
}
