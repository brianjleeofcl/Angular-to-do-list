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

app.use(express.static(path.resolve('public')));


app.use(token);
app.use(users);

app.use(sidenav);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  if (app.get('env') !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
  }
});
