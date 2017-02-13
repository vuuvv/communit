
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('t_wechat_user', function(table) {
        table.increments('id').primary();
        table.integer('officialAccountId').unsigned().notNullable();
        table.integer('userId').unsigned().nullable();
        table.string('openId', 60).notNullable();
        table.string('nickname', 30).notNullable();
        table.tinyint('sex').notNullable();
        table.string('language', 30).notNullable();
        table.string('city', 30).notNullable();
        table.string('province', 30).notNullable();
        table.string('country', 30).notNullable();
        table.text('headimgurl').nullable();
        table.bigInteger('subscribeTime').notNullable();
        table.text('remark').nullable();
        table.integer('groupId').nullable();
        table.text('tagIdList').nullable();
        table.timestamp('latestActiveAt').nullable();
        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));

        // index
        table.unique(['openId', 'officialAccountId']);
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('t_wechat_user'),
  ]);
};
