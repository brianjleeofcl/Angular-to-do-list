
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tags', (table) => {
    table.increments();
    table.integer('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE').index();
    table.string('tag_name').notNullable();
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('tags')
};
