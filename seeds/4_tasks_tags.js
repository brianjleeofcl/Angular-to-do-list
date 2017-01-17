
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('tasks_tags').del()
    .then(function () {
      return knex('tasks_tags').insert([{
        id: 1,
        task_id: 1,
        tag_id: 1,
      },
      {
        id: 2,
        task_id: 2,
        tag_id: 2,
      },
      {
        id: 3,
        task_id: 3,
        tag_id: 1,
      },
      {
        id: 4,
        task_id: 4,
        tag_id: 1,
      },
      {
        id: 5,
        task_id: 5,
        tag_id: 2,
      }]);
    }).then(() => knex.raw("SELECT setval('tasks_tags_id_seq', (SELECT MAX(id) FROM tasks_tags));"));
};
