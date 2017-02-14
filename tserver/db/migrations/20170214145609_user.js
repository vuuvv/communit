
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('t_user', function(table) {
        table.increments('id').primary();
        table.string('phone', 30).notNullable();
        table.string('name', 30).notNullable();
        table.string('area', 200).notNullable();
        table.string('address', 200).notNullable();
        table.tinyint('sex').nullable();
        table.text('avatar').nullable();
        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));

        // index
        table.unique(['phone']);
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('t_user'),
  ]);
};
