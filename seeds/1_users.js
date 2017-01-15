
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return knex('table_name').insert([{
        id: 1,
        first_name: 'John',
        last_name: 'Smith',
        email: 'contact@example.com',
        hash_pw: '',
        phone: '+12061112222',
        created_at: new Date('2017-01-14 20:27:00 PST'),
        updated_at: new Date('2017-01-14 20:27:00 PST')
      }])
    });
};
