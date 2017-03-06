var uuid = require('uuid/v4');

exports.seed = function(knex, Promise) {
  return knex('t_transaction_type').truncate()
    .then(function () {
      return Promise.all([
        knex('t_transaction_type').insert({id: uuid(), name: '收公益活动积分'}),
        knex('t_transaction_type').insert({id: uuid(), name: '付工艺活动积分'}),
        knex('t_transaction_type').insert({id: uuid(), name: '收自助服务积分'}),
        knex('t_transaction_type').insert({id: uuid(), name: '付自助服务积分'}),
        knex('t_transaction_type').insert({id: uuid(), name: '收商品积分'}),
        knex('t_transaction_type').insert({id: uuid(), name: '付商品积分'}),
        knex('t_transaction_type').insert({id: uuid(), name: '收购买积分'}),
      ]);
    });
};
