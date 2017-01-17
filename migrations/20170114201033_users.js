'use strict';

exports.up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('name').defaultTo('');
    table.string('email').unique().notNullable();
    table.specificType('hash_pw', 'char(60)').notNullable();
    table.specificType('phone', 'char(12)').defaultTo('000000000000');
    table.timestamps(true, true);
  });
};

exports.down = knex => knex.schema.dropTable('users');
