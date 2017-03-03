
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('t_account_type', function(table) {
        table.uuid('id').primary();
        table.string('name', 30).notNullable();
        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));
    }),
    knex.schema.createTable('t_account', function(table) {
        table.uuid('id').primary();
        table.string('typeId', 36).notNullable();
        table.string('communityId', 36).notNullable();
        table.decimal('balance', 12, 2).notNullable();
        table.timestamp('expiresTime').notNullable();
        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));

        // index
        table.index(['expiresTime']);
    }),
    knex.schema.createTable('t_transaction_type', function(table) {
        table.uuid('id').primary();
        table.string('name', 30).notNullable();
        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));
    }),
    knex.schema.createTable('t_transaction', function(table) {
        table.uuid('id').primary();
        table.string('communityId', 36).notNullable();
        table.string('userId', 36).notNullable();
        table.string('typeId', 36).notNullable();
        table.decimal('amount').notNullable();
        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));

        // index
        table.index(['userId', 'typeId']);
        table.index(['typeId']);
    }),
    knex.schema.createTable('t_transaction_detail', function(table) {
        table.uuid('id').primary();
        table.string('userId').notNullable();
        table.string('transactionId').notNullable();
        table.string('accountId').notNullable();
        table.decimal('amount').notNullable();
        table.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.timestamp('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP'));

        // index
        table.unique(['transactionId', 'accountId']);
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('t_account_type'),
    knex.schema.dropTable('t_account'),
    knex.schema.dropTable('t_transaction_type'),
    knex.schema.dropTable('t_transaction'),
    knex.schema.dropTable('t_transaction_detail'),
  ]);
};
