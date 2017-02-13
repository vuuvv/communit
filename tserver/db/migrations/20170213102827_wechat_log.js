
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('t_wechat_log', function(table) {
        table.increments('id').primary();
        table.integer('officialAccountId').unsigned().notNullable();
        table.text('request').notNullable();
        table.text('response').nullable();
        table.string('type', 30).notNullable();
        table.string('event', 30).nullable();
        table.string('from', 150).notNullable();
        table.string('to', 150).notNullable();
        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('t_wechat_log'),
  ]);
};
