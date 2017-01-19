/* eslint-disable strict */

'use strict';

exports.seed = knex => knex('users').del()
    .then(() => knex('users').insert([{
      id: 1,
      name: 'John Smith',
      email: 'contact@example.com',
      hash_pw: '$2a$12$/uBxx2hmE6arf9EyQfjHC.UWbGWNUi22iMLGrY9Kq4NCO8/KpYWdW',
      // 'password'
      phone: '+12061112222',
      created_at: new Date('2017-01-14 20:27:00 PST'),
      updated_at: new Date('2017-01-14 20:27:00 PST'),
    }, {
      id: 2,
      name: 'Debbie Gibson',
      email: 'debbie@example.com',
      hash_pw: '$2a$12$/uBxx2hmE6arf9EyQfjHC.UWbGWNUi22iMLGrY9Kq4NCO8/KpYWdW',
      // 'password'
      phone: '+12061112222',
      created_at: new Date('2017-01-14 20:27:00 PST'),
      updated_at: new Date('2017-01-14 20:27:00 PST'),
    }, {
      id: 3,
      name: 'Jane McCarthy',
      email: 'jane@example.com',
      hash_pw: '$2a$12$/uBxx2hmE6arf9EyQfjHC.UWbGWNUi22iMLGrY9Kq4NCO8/KpYWdW',
      // 'password'
      phone: '+12061112222',
      created_at: new Date('2017-01-14 20:27:00 PST'),
      updated_at: new Date('2017-01-14 20:27:00 PST'),
    }, {
      id: 4,
      name: 'Mark Olsen',
      email: 'mark@example.com',
      hash_pw: '$2a$12$/uBxx2hmE6arf9EyQfjHC.UWbGWNUi22iMLGrY9Kq4NCO8/KpYWdW',
      // 'password'
      phone: '+12061112222',
      created_at: new Date('2017-01-14 20:27:00 PST'),
      updated_at: new Date('2017-01-14 20:27:00 PST'),
    }]))
      .then(() => knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"));
