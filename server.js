'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');

const express = require('express');
const app = express();

app.disable('x-powered-by');

const token = require('./routes/token');
const users = require('./routes/users');

app.use(express.static(path.resolve('public')));


app.use(token);
app.use(users);


const port = process.env.PORT || 8000;

app.listen(port, () => {
  if (app.get('env') !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
  }
});
