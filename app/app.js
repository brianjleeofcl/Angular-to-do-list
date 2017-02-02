/* eslint-disable strict */

'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const express = require('express');
const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

const token = require('./routes/token');
const users = require('./routes/users');
const sidenav = require('./routes/sidenav');
const list = require('./routes/list');
const tags = require('./routes/tags');
const shared = require('./routes/shared');


app.use(token);
app.use(users);

app.use(sidenav);
app.use(list);
app.use(tags);
app.use(shared);

app.use('*', function(req, res, next) {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')})
});
// eslint-disable-next-line max-params
app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

module.exports = app;
