'use strict';

const knex = require('../knex');

const bcrypt = require('bcrypt-as-promised');

const jwt = require('jsonwebtoken');

const { camelizeKeys } = require('humps');

const express = require('express');

const router = express.Router();

router.get('/token', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err) => {
    if (err) {
      return res.send(false);
    }

    return res.send(true);
  });
});

router.post('/token', (req, res, next) => {
  let user;
  const { email, password } = req.body;

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

router.delete('/token', (req, res, next) => {
  res.clearCookie('token').send(false);
});

module.exports = router;
