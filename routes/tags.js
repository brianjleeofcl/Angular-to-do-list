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
  let tags = {};

  knex.select('tag_name').from('tags').where('user_id', req.claim.userId)
    .then((array) => {
      tags = camelizeKeys(array).reduce((acc, obj) => {
        acc[obj.tagName] = null;

        return acc;
      }, tags);

      return knex('users_tags')
        .innerJoin('tags', 'users_tags.tag_id', 'tags.id')
        .where('users_tags.user_id', req.claim.userId).select('tag_name');
    }).then((array) => {
      tags = camelizeKeys(array).reduce((acc, obj) => {
        acc[obj.tagName] = null;

        return acc;
      }, tags);

      res.send(tags);
    })
  .catch(err => next(err));
});

router.get('/tags/:tagName', auth, (req, res, next) => {
  const tagName = req.params.tagName.replace('%20', ' ');

  knex.select('tags.id')
    .from('tags').innerJoin('users_tags', 'tags.id', 'users_tags.tag_id')
    .where('users_tags.user_id', req.claim.userId)
    .where('tag_name', tagName)
    .then((array) => {
      if (!array.length) {
        throw boom.notFound('Tag not found');
      }

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

router.get('/tags-shared?', auth, (req, res, next) => {
  console.log('check');
  const tagName = req.query.tagName;
  console.log(tagName);

  knex('tags').where('tag_name', tagName).then((array) => {
    if(array[0].shared) {
      return knex('users_tags').select('email')
        .innerJoin('users', 'users.id', 'users_tags.user_id')
        .where('tag_id', array[0].id);
    } else {
      return false;
    }
  }).then((data) => res.send(data)).catch((error) => next(error))
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
  let tag;

  knex('tags')
    .where('user_id', userId)
    .where('tag_name', tagName)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Tag not found');
      }
      tag = camelizeKeys(row);

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
