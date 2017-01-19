/* eslint-disable strict */

'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/todo_dev',
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};
