
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('t_config', function(table) {
        table.increments('id').primary();
        table.string('key', 100).notNullable();
        table.text('value').notNullable();
        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));

        // index
        table.unique(['key']);
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('t_config'),
  ]);
};
