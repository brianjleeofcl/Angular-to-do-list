/* eslint-disable strict, no-unused-vars, func-names, consistent-return, no-param-reassign */

'use strict';

const knex = require('../knex');
const jwt = require('jsonwebtoken');
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

router.get('/sidenav', auth, (req, res, next) => {
  let userData;

  knex('users').where('id', req.claim.userId).then((array) => {
    const { name, email } = camelizeKeys(array[0]);
    userData = { name, email };

    return knex('tags').where('user_id', req.claim.userId)
      .select('tag_name', 'id', 'shared');
  })
  .then((array) => {
    userData.tags = camelizeKeys(array).filter(row => !row.shared);
    userData.shared = camelizeKeys(array).filter(row => row.shared);

    return knex('users_tags')
      .innerJoin('tags', 'users_tags.tag_id', 'tags.id')
      .where('users_tags.user_id', req.claim.userId)
      .whereNot('tags.user_id', req.claim.userId).select('tag_name', 'tags.id');
  })
  .then((array) => {
    const sharedByOthers = camelizeKeys(array);

    userData.shared = userData.shared.concat(sharedByOthers);

    res.send(userData);
  })
  .catch(err => next(err));
});

module.exports = router;
