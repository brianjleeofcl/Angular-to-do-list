/* eslint-disable strict */

'use strict';

exports.seed = knex => knex('tasks').del()
    .then(() => knex('tasks').insert([{
      id: 1,
      user_id: 1,
      task_name: 'Pick up dog food',
      completed_at: null,
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    },
    {
      id: 2,
      user_id: 1,
      task_name: 'Write report',
      completed_at: null,
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    },
    {
      id: 3,
      user_id: 1,
      task_name: 'Mow lawn',
      completed_at: new Date('2017-01-15 20:27:00 PST'),
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    },
    {
      id: 4,
      user_id: 1,
      task_name: 'Wash car',
      completed_at: null,
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    },
    {
      id: 5,
      user_id: 1,
      task_name: 'Meeting prep',
      completed_at: new Date('2017-01-15 20:27:00 PST'),
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    },
    {
      id: 6,
      user_id: 1,
      task_name: 'Share notes',
      completed_at: null,
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    },
    {
      id: 7,
      user_id: 1,
      task_name: 'Make presentation',
      completed_at: null,
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    },
    {
      id: 8,
      user_id: 1,
      task_name: 'Print handouts',
      completed_at: null,
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    },
    {
      id: 9,
      user_id: 1,
      task_name: 'Set date for surprise party',
      completed_at: new Date('2017-01-15 20:27:00 PST'),
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    },
    {
      id: 10,
      user_id: 1,
      task_name: 'Plan ski trip',
      completed_at: null,
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    },
    {
      id: 11,
      user_id: 1,
      task_name: 'Watch playoffs',
      completed_at: null,
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    }]))
      .then(() => knex.raw("SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks));"));
