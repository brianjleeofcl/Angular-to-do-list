
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return knex('users').insert([{
        id: 1,
        first_name: 'John',
        last_name: 'Smith',
        email: 'contact@example.com',
        hash_pw: '$2a$12$/uBxx2hmE6arf9EyQfjHC.UWbGWNUi22iMLGrY9Kq4NCO8/KpYWdW',
        // 'password'
        phone: '+12061112222',
        created_at: new Date('2017-01-14 20:27:00 PST'),
        updated_at: new Date('2017-01-14 20:27:00 PST')
      }])
    }).then(() => knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"));
};
