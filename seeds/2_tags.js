'use strict';

exports.seed = knex => knex('tags').del()
    .then(() => knex('tags').insert([{
      id: 1,
      user_id: 1,
      tag_name: 'home',
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    },
    {
      id: 2,
      user_id: 1,
      tag_name: 'work',
      created_at: new Date('2017-01-15 20:27:00 PST'),
      updated_at: new Date('2017-01-15 20:27:00 PST'),
    }]))
    .then(() => knex.raw("SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags));"));
