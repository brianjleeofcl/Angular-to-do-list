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

router.post('/task', auth, (req, res, next) => {
  const userId = req.claim.userId;
  const { taskName, tags } = req.body;
  const task = { taskName, userId };
  // eslint-disable-next-line no-unused-vars
  let tagIds = [];
  let taskId;
  let addedTask;

  knex('tasks')
    .insert(decamelizeKeys(task), '*')
    .then((row) => {
      taskId = camelizeKeys(row[0]).id;
      addedTask = camelizeKeys(row[0]);
      tagIds = tagIds.concat(tags.filter((str) => str.match(/\d+/)));

      const promises = tags.filter((str) => {
        return str.match(/^n-/);
      })
        .map((str) => {
          const tagName = str.slice(2)
          return knex('tags')
            .insert(decamelizeKeys({ userId, tagName }), 'id')
            .then((array) => array[0])
        });

      return Promise.all(promises)
    }).then((arr) => {
      tagIds = tagIds.concat(arr)

      const rows = decamelizeKeys(tagIds.map((tagId) => {
        return { tagId, taskId }
      }));

      return knex('tasks_tags').insert(rows, '*');
    })
    .then(() => {
      res.send(addedTask);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/task', auth, (req, res, next) => {

  const id = req.body.id;
  let tagIds = [];
  let patchedTask;

  knex('tasks').where('id', id).then((array) => {
    if (!array.length) {
      throw boom.notFound();
    } else {
      const taskName = req.body.taskName || array[0].taskName;
      const completedAt = req.body.completedAt !== undefined ? req.body.completedAt : array[0].taskName;

      const row = { taskName, completedAt, updatedAt: new Date() };

      return knex('tasks').where('id', id).update(decamelizeKeys(row), '*');
    }
  }).then((array) => {
    const userId = req.claim.userId;
    const tags = req.body.tags || [];
    patchedTask = camelizeKeys(array[0]);

    if (!tags.length) {
      return [];
    }

    tagIds = tagIds.concat(tags.filter((str) => str.match(/\d+/)));

    const promises = tags.filter((str) => {
      return str.match(/^n-/);
    })
      .map((str) => {
        const tagName = str.slice(2)
        return knex('tags')
          .insert(decamelizeKeys({ userId, tagName }), 'id')
          .then((array) => array[0])
      });

    return Promise.all(promises)
  })
  .then((arr) => {
    tagIds = tagIds.concat(arr)

    const rows = tagIds.map(tagId => {
      return { tagId, taskId: patchedTask.id }
    });

    return knex('tasks_tags').insert(decamelizeKeys(rows), '*');
  })
  .then(() => {
    res.send(camelizeKeys(patchedTask));
  })
  .catch(err => next(err));
});

router.delete('/list', auth, (req, res, next) => {
  const id = req.body.id;
  const clause = { id };
  let task;

  knex('tasks')
    .where(clause)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Task not found');
      }

      task = camelizeKeys(row);

      return knex('tasks')
        .del()
        .where('id', task.id);
    })
    .then(() => {
      delete task.id;

      res.send(task);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/list/completed', auth, (req, res, next) => {
  const userId = req.claim.userId;

  knex('tasks')
    .whereNotNull('completed_at')
    .where('user_id', userId)
    .del('*')
    .then((row) => {
      if (!row) {
        throw boom.create(500, 'Internal Server Error');
      }
      res.send(row);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
