/* eslint-disable strict, func-names, consistent-return, no-param-reassign, no-shadow */

'use strict';

const knex = require('../knex');
const boom = require('boom');
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

router.get('/list', auth, (req, res, next) => {
  const id = req.claim.userId;

  Promise.all([
    knex('users_tags')
      .innerJoin('tasks_tags', 'tasks_tags.tag_id', 'users_tags.tag_id')
      .innerJoin('tasks', 'tasks_tags.task_id', 'tasks.id')
      .innerJoin('users', 'tasks.user_id', 'users.id')
      .where('users_tags.user_id', id)
      .select('tasks.id', 'tasks.user_id', 'users.email', 'task_name', 'completed_at'),
    knex('tasks').select('id', 'user_id', 'task_name', 'completed_at')
      .where('tasks.user_id', req.claim.userId).orderBy('completed_at', 'DESC')
  ]).then((data) => {
      const flattened = [].concat(...data);
      const array = [];
      const key = [];
      for (const obj of camelizeKeys(flattened)) {
        if (obj.userId == id) {
          delete obj.email;
        }
        if (!key.includes(obj.id)) {
          array.push(obj);
          key.push(obj.id);
        }
      }

      const promises = array.map(obj => knex('tasks_tags')
          .innerJoin('tags', 'tasks_tags.tag_id', 'tags.id')
          .where('tasks_tags.task_id', obj.id)
          .then((array) => {
            obj.tags = camelizeKeys(array).map(tag => {
              const tagName = tag.tagName
              const tagId = tag.tagId
              return { tagName, tagId }
            });
            return obj;
          }));

      return Promise.all(promises);
    })
    .then((data) => {
      res.send(data);
    })
    .catch(err => next(err));
});

module.exports = router;
