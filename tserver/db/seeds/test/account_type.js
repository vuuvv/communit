exports.seed = function(knex, Promise) {
  return knex('t_account_type').truncate()
    .then(function () {
      return Promise.all([
        knex('t_account_type').insert({name: '公益积分'}),
        knex('t_account_type').insert({name: '购买积分'}),
      ]);
    });
};
