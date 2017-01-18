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

// Deletes a tag separately from any task association.
router.delete('/tags', auth, (req, res, next) => {
  const userId = req.claim.userId;
  const { tagName } = req.body;
  const clause = decamelizeKeys({ tagName, userId });
  let tag;

  knex('tags')
    // .where(clause)
    .where('user_id', userId)
    .where('tag_name', tagName)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Tag not found');
      }
      tag = camelizeKeys(row);
      console.log(tag);

      return knex('tags')
        .del('*')
        .where('tag_name', tag.tagName);
    })
    .then(() => {
      delete tag.id;

      res.send(tag);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
