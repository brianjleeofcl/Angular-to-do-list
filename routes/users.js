/* eslint-disable strict, no-mixed-operators, no-unused-vars */

'use strict';

const knex = require('../knex');

const bcrypt = require('bcrypt-as-promised');

const jwt = require('jsonwebtoken');

const boom = require('boom');

const { camelizeKeys, decamelizeKeys } = require('humps');

const express = require('express');

const ev = require('express-validation');

const validations = require('../validations/users');

const router = express.Router();

const app = express();

router.post('/users', ev(validations.post), (req, res, next) => {
  let user;
  const { name, email, password, password_verify, phone } = req.body;
  console.log(req.body)

  if (!name || name.trim() === '') {
    return next(boom.create(400, 'Name field must not be blank'));
  }

  if (!email || email.trim() === '') {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(400, 'Passwords must be at least 8 characters long'));
  }

  if (!password_verify || password_verify.length < 8) {
    return next(boom.create(400, 'Passwords must be at least 8 characters long'));
  }

  if (!phone || phone.length < 10) {
    return next(boom.create(400, 'Please enter your ten digit phone number'));
  }

  knex('users').where('email', email).then((data) => {
    if (data.length) {
      throw new Error('email exists');
    }

    return bcrypt.hash(password, 12);
  }).then((hashPw) => {
    user = { name, email, hashPw, phone };

    return knex('users').insert(decamelizeKeys(user), '*');
  })
  .then((array) => {
    delete user.hashPw;

    const claim = { userId: array[0].id };
    const token = jwt.sign(claim, process.env.JWT_KEY, {
      expiresIn: '120 days',
    });

    res.cookie('token', token, {
      httpOnly: true,
      expiresIn: new Date(Date.now() + 3600000 * 24 * 120),
      secure: router.get('env') === 'Production',
    }).send(user);
  })
  .catch(err => next(err));
});

app.use((err, _req, res, _next) => {
  if (err.status) {
    return res.status(err.status).send(err);
  }

  // Handle boom errors
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  console.error(err.stack);
  res.sendStatus(500);
});


module.exports = router;
