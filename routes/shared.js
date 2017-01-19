/* eslint-disable strict, func-names, consistent-return, no-param-reassign, no-unused-vars */

'use strict';

const knex = require('../knex');

const jwt = require('jsonwebtoken');

const boom = require('boom');

const { camelizeKeys, decamelizeKeys } = require('humps');

const express = require('express');

const router = express.Router();

const auth = function (req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return next(err);
    }

    req.claim = payload;

    next();
  });
};

router.post('/shared', auth, (req, res, next) => {
  const { tagName, userIds } = req.body;
  const userId = req.claim.userId;
  const tag = decamelizeKeys({ userId, tagName, shared: true });

  knex('tags').insert(tag, '*').then((array) => {
    if (!array.length) {
      throw new Error();
    }

    const tagId = array[0].id;

    if (!userIds.includes(userId)) {
      userIds.push(userId);
    }

    const rows = userIds.map((userId) => ({ userId, tagId }));

    return knex('users_tags').insert(decamelizeKeys(rows), '*')
  }).then((array) => {
    res.send({ tagName });
  }).catch((err) => next(err));
});

module.exports = router;
