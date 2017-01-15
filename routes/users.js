'use strict';

const knex = require('../knex');

const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');

const { camelizeKeys, decamelizeKeys } = require('humps');

const express = require('express');
const router = express.Router();

router.post('/users', (req, res, next) => {
  let user;
  const { firstName, lastName, email, password, phone } = req.body;

  knex('users').where('email', email).then((data) => {
    if (data.length) {
      throw new Error('email exists')
    }

    return bcrypt.hash(password, 12);
  }).then((hashPw) => {
    user = { firstName, lastName, email, hashPw, phone };

    return knex('users').insert(decamelizeKeys(user), '*');
  }).then((array) => {
    delete user.hashPw;

    res.send(user);
  }).catch((err) => next(err));
});


module.exports = router;
