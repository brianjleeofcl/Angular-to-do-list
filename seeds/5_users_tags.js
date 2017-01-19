
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users_tags').del()
    .then(() => {
      return knex('users_tags').insert([{
      id: 1,
      user_id: 1,
      tag_id: 3
    }, {
      id: 2,
      user_id: 2,
      tag_id: 3
    }, {
      id: 3,
      user_id: 3,
      tag_id: 3
    }, {
      id: 4,
      user_id: 1,
      tag_id: 4
    }, {
      id: 5,
      user_id: 2,
      tag_id: 4
    }, {
      id: 6,
      user_id: 4,
      tag_id: 4
    }])
  })
    .then(() => knex.raw("SELECT setval('users_tags_id_seq', (SELECT MAX(id) FROM users_tags));"));
};
