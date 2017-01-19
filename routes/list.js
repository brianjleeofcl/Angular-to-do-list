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
  knex('tasks').select('id', 'user_id', 'task_name', 'completed_at')
    .where('tasks.user_id', req.claim.userId).orderBy('completed_at', 'DESC')
    .then((array) => {
      const promises = camelizeKeys(array).map(obj => knex('tasks_tags')
          .innerJoin('tags', 'tasks_tags.tag_id', 'tags.id')
          .where('tasks_tags.task_id', obj.id)
          .then((array) => {
            obj.tags = camelizeKeys(array).map(tag => tag.tagName);
            return obj;
          }));

      return Promise.all(promises);
    })
    .then((data) => {
      res.send(data);
    })
    .catch(err => next(err));
});

router.post('/list', auth, (req, res, next) => {
  const userId = req.claim.userId;
  const { taskName, tags } = req.body;
  const task = { taskName, userId };
  // eslint-disable-next-line no-unused-vars
  const tagIds = [];
  let taskId;
  let addedTask;

  knex('tasks')
    .insert(decamelizeKeys(task), '*')
    .then((row) => {
      taskId = camelizeKeys(row[0]).id;
      addedTask = camelizeKeys(row[0]);

      const promises = tags.map(tagName => knex('tags')
          .where(decamelizeKeys({ tagName, userId })).then((array) => {
            if (array.length) {
              return array[0].id;
            }
            return knex('tags')
              .insert(decamelizeKeys({ userId, tagName }), 'id')
              .then(array => array[0]);
          }));

      return Promise.all(promises);
    }).then((arr) => {
      const rows = decamelizeKeys(arr.map(tagId => ({ tagId, taskId })));

      return knex('tasks_tags').insert(rows, '*');
    })
    .then(() => {
      res.send(addedTask);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/list', auth, (req, res, next) => {
  const id = req.body.id;

  knex('tasks').where('id', id).then((array) => {
    if (!array.length) {
      throw new Error();
    } else {
      const row = {
        taskName: req.body.taskName || array[0].taskName,
        completedAt: req.body.completedAt || array[0].completedAt,
        updatedAt: new Date(),
      };

      return knex('tasks').where('id', id).update(decamelizeKeys(row), '*');
    }
  }).then((array) => {
    const userId = req.claim.userId;
    const tags = req.body.tags || [];

    if (!tags.length) {
      res.send(array[0]);
    }

    const promises = tags.map(tagName => knex('tags').where(decamelizeKeys({ userId, tagName }))
        .then((array) => {
          if (array.length) {
            return array[0].id;
          }

          return knex('tags')
            .insert(decamelizeKeys({ userId, tagName }), 'id')
            .then(array => array[0]);
        }));

    return Promise.all(promises);
  })
  .then((arr) => {
    const rows = decamelizeKeys(arr.map(tagId => ({ tagId, taskId: id })));

    return knex('tasks_tags').insert(rows, '*');
  })
  .then((array) => {
    res.send(camelizeKeys(array[0]));
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
