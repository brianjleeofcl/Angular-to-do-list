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

  knex.select('tag_name', 'shared', 'id').from('tags').where('user_id', req.claim.userId)
    .then((array) => {
      tags = camelizeKeys(array).reduce((acc, obj) => {
        const name = obj.shared ? `${obj.tagName}-shared` : obj.tagName;
        acc[name] = obj.id;

        return acc;
      }, tags);

      return knex('users_tags')
        .innerJoin('tags', 'users_tags.tag_id', 'tags.id')
        .where('users_tags.user_id', req.claim.userId)
        .select('tag_name', 'tags.id');
    }).then((array) => {
      tags = camelizeKeys(array).reduce((acc, obj) => {
        acc[`${obj.tagName}-shared`] = obj.id;

        return acc;
      }, tags);

      res.send(tags);
    })
  .catch(err => next(err));
});

router.get('/tags-id?', auth, (req, res, next) => {
  const userId = req.claim.userId;
  const tagId = req.query.tagId;
  let tagName;

  knex('tags').where('id', tagId).where('user_id', userId)
    .then((array) => {
      if (!array.length) {
        return knex('users_tags')
          .innerJoin('tags', 'users_tags.tag_id', 'tags.id')
          .where('tag_id', tagId).where('users_tags.user_id', userId);
      } else {
        return array;
      }
    })
    .then((array) => {
      if (!array.length) {
        throw boom.unauthorized()
      }

      tagName = camelizeKeys(array[0]).tagName;

      return knex('tasks_tags')
        .innerJoin('tasks', 'tasks_tags.task_id', 'tasks.id')
        .where('tag_id', tagId)
    })
    .then((array) => {
      res.send({ tasks: camelizeKeys(array), tagName });
    })
    .catch(err => next(err));
});

router.get('/tags-shared?', auth, (req, res, next) => {
  const tagName = req.query.tagName;

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
  const { tagId, taskId } = req.body;

  knex('tasks_tags').where('tag_id', tagId).where('task_id', taskId).del('*')
    .then((array) => {
      res.send(array[0]);
    })
    .catch(err => next(err));
});

// Deletes a tag separately from any task association.
router.delete('/tags', auth, (req, res, next) => {
  const userId = req.claim.userId;
  const { tagId } = req.body;
  let tag;

  knex('tags')
    .where('user_id', userId)
    .where('id', tagId)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Tag not found');
      }
      tag = camelizeKeys(row);

      return knex('tags')
        .del('*')
        .where('id', tagId);
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
