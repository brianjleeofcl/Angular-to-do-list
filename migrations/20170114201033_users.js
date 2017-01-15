
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('first_name').defaultTo('');
    table.string('last_name').defaultTo('');
    table.string('email').unique().notNullable();
    table.specificType('hash_pw', 'char(60)').notNullable();
    table.specificType('phone', 'char(12)').defaultTo('000000000000');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
