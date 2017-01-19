
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users_tags', (table) => {
    table.increments();
    table.integer('user_id').references('id').inTable('users')
      .onDelete('CASCADE').index();
    table.integer('tag_id').references('id').inTable('tags')
      .onDelete('CASCADE').index();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users_tags');
};
