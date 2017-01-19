/* eslint-disable strict */

'use strict';

exports.seed = knex => knex('tasks_tags').del()
  .then(() => knex('tasks_tags').insert([{
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
  },
  {
    id: 6,
    task_id: 6,
    tag_id: 3
  },
  {
    id: 7,
    task_id: 7,
    tag_id: 3
  },
  {
    id: 8,
    task_id: 8,
    tag_id: 3
  },
  {
    id: 9,
    task_id: 9,
    tag_id: 4,
  },
  {
    id: 10,
    task_id: 10,
    tag_id: 4
  },
  {
    id: 11,
    task_id: 11,
    tag_id: 4
  }]))
    .then(() => knex.raw("SELECT setval('tasks_tags_id_seq', (SELECT MAX(id) FROM tasks_tags));"));
