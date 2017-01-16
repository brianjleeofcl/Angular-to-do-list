
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tasks').del()
    .then(function () {
      return knex('tasks').insert([{
        id: 1,
        user_id: 1,
        task_name: 'Pick up dog food',
        completed_at: null,
        created_at: new Date('2017-01-15 20:27:00 PST'),
        updated_at: new Date('2017-01-15 20:27:00 PST')
      },{
        id: 2,
        user_id: 1,
        task_name: 'Write report',
        completed_at: null,
        created_at: new Date('2017-01-15 20:27:00 PST'),
        updated_at: new Date('2017-01-15 20:27:00 PST')
      },{
        id: 3,
        user_id: 1,
        task_name: 'Mow lawn',
        completed_at: new Date('2017-01-15 20:27:00 PST'),
        created_at: new Date('2017-01-15 20:27:00 PST'),
        updated_at: new Date('2017-01-15 20:27:00 PST')
      },{
        id: 4,
        user_id: 1,
        task_name: 'Wash car',
        completed_at: null,
        created_at: new Date('2017-01-15 20:27:00 PST'),
        updated_at: new Date('2017-01-15 20:27:00 PST')
      },{
        id: 5,
        user_id: 1,
        task_name: 'Meeting prep',
        completed_at: new Date('2017-01-15 20:27:00 PST'),
        created_at: new Date('2017-01-15 20:27:00 PST'),
        updated_at: new Date('2017-01-15 20:27:00 PST')
      }])
    }).then(() => knex.raw("SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks));"));
};
