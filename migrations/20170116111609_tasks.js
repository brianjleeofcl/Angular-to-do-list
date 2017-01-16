
exports.up = function(knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments();
    table.integer('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE').index();
    table.string('task_name').notNullable();
    table.timestamp('completed_at').defaultTo(null);
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('tasks')
};
