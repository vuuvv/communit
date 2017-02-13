
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('t_wechat_official_account', function(table) {
        table.increments('id').primary();
        table.string('name', 50).notNullable();
        table.string('appId', 100).notNullable();
        table.string('appSecret', 100).notNullable();
        table.string('token', 100).notNullable();
        table.string('accessToken', 255);
        table.bigInteger('expiresIn').nullable();
        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('t_wechat_official_account'),
  ]);
};
