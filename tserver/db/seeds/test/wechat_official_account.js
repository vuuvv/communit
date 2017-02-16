
exports.seed = function(knex, Promise) {
  const table = 't_wechat_official_account';
  return knex(table).truncate()
    .then(function () {
      return Promise.all([
        knex(table).insert({ name: '丰泽社区', appId: 'wx520323785515dd5f', appSecret: '4f6c57912844071dc8f27c1c415b9317', token: 'weixinvuuvv123vuuvvweixin'}),
      ]);
    });
};
