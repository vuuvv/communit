
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('t_config').truncate()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('t_config').insert({key: 'site', value: JSON.stringify({
          title: '众邻',
          domain: 'weixin.vuuvv.com',
          host: 'http://weixin.vuuvv.com',
          clientHost: 'http://192.168.1.19:4200',
        })}),
      ]);
    });
};
