
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tasks_tags', (table) => {
    table.increments();
    table.integer('task_id').notNullable()
      .references('id').inTable('tasks').onDelete('CASCADE').index();
    table.integer('tag_id').notNullable()
      .references('id').inTable('tags').onDelete('CASCADE').index();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tasks_tags');
};
