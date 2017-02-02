/* eslint-disable strict, no-unused-vars, no-mixed-operators */

'use strict';

const knex = require('../knex');

const bcrypt = require('bcrypt-as-promised');

const jwt = require('jsonwebtoken');

const { camelizeKeys } = require('humps');

const express = require('express');

const router = express.Router();

const boom = require('boom');

const ev = require('express-validation');

const validations = require('../validations/users');

const app = express();

router.get('/token', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err) => {
    if (err) {
      return res.send(false);
    }

    return res.send(true);
  });
});
// eslint-disable-next-line consistent-return
router.post('/token', (req, res, next) => {
  let user;
  const { email, password } = req.body;

  if (!email || email.trim() === '') {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(400, 'Passwords must be at least 8 characters long'));
  }
  knex('users').where('email', email).then((data) => {
    if (!data.length) {
      throw new Error('not found');
    }

    user = camelizeKeys(data[0]);

    return bcrypt.compare(password, user.hashPw);
  }).then(() => {
    delete user.hashPw;

    const claim = { userId: user.id };
    const token = jwt.sign(claim, process.env.JWT_KEY, {
      expiresIn: '120 days',
    });

    res.cookie('token', token, {
      httpOnly: true,
      expiresIn: new Date(Date.now() + 3600000 * 24 * 120),
      secure: router.get('env') === 'Production',
    }).send(user);
  })
  .catch(bcrypt.MISMATCH_ERROR, () => {
    throw new Error('bad password');
  })
  .catch(err => next(err));
});

// eslint-disable-next-line consistent-return
app.use((err, _req, res, _next) => {
  if (err.status) {
    return res.status(err.status).send(err);
  }

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

router.delete('/token', (req, res, next) => {
  res.clearCookie('token').send(false);
});

module.exports = router;
