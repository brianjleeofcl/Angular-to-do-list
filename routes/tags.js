/* eslint-disable strict, func-names, consistent-return, no-param-reassign, no-unused-vars */

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

router.get('/tags', auth, (req, res, next) => {
  knex.select('tag_name').from('tags').where('user_id', req.claim.userId)
    .then((array) => {
      const tags = camelizeKeys(array).reduce((acc, obj) => {
        acc[obj.tagName] = null;

        return acc;
      }, {});

      res.send(tags);
    })
  .catch(err => next(err));
});

router.get('/tags/:tagName', auth, (req, res, next) => {
  const tagName = req.params.tagName;

  knex.select('id').from('tags').where('user_id', req.claim.userId)
    .where('tag_name', tagName)
    .then((array) => {
      const tagId = array[0].id;

      return knex('tasks_tags')
        .innerJoin('tasks', 'tasks_tags.task_id', 'tasks.id')
        .where('tag_id', tagId);
    })
    .then((array) => {
      res.send(camelizeKeys(array));
    })
    .catch(err => next(err));
});

router.delete('/tags', auth, (req, res, next) => {

});

router.delete('/task-tag', auth, (req, res, next) => {
  const { tagName, taskId } = req.body;

  knex('tags').innerJoin('tasks_tags', 'tags.id', 'tasks_tags.tag_id')
    .where('tags.tag_name', tagName)
    .where('tasks_tags.task_id', taskId)
    .select('tasks_tags.id')
    .then((array) => {
      const id = array[0].id;

      return knex('tasks_tags').where('id', id).del('*');
    })
    .then((array) => {
      res.send(array[0]);
    })
    .catch(err => next(err));
});

module.exports = router;
