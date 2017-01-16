'use strict';

const knex = require('../knex');

const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');

const { camelizeKeys, decamelizeKeys } = require('humps');

const express = require('express');
const router = express.Router();

router.post('/users', (req, res, next) => {
  let user;
  const { name, email, password, phone } = req.body;

  knex('users').where('email', email).then((data) => {
    if (data.length) {
      throw new Error('email exists')
    }

    return bcrypt.hash(password, 12);
  }).then((hashPw) => {
    user = { name, email, hashPw, phone };

    return knex('users').insert(decamelizeKeys(user), '*');
  }).then((array) => {
    delete user.hashPw;

    const claim = { userId: array[0].id }
    const token = jwt.sign(claim, process.env.JWT_KEY, {
      expiresIn: '120 days'
    })

    res.cookie('token', token, {
      httpOnly: true,
      expiresIn: new Date(Date.now() + 3600000 * 24 * 120),
      secure: router.get('env') === 'Production'
    }).send(user);
  }).catch((err) => next(err));
});


module.exports = router;
