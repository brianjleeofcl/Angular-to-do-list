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
      .where('users_tags.user_id', id)
      .select('tasks.id', 'tasks.user_id', 'task_name', 'completed_at'),
    knex('tasks').select('id', 'user_id', 'task_name', 'completed_at')
      .where('tasks.user_id', req.claim.userId).orderBy('completed_at', 'DESC')
  ]).then((data) => {
      const flattened = [].concat(...data);
      const array = [];
      const key = [];
      for (const obj of flattened) {
        if (!key.includes(obj.id)) {
          array.push(obj);
          key.push(obj.id);
        }
      }
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

router.patch('/list', auth, (req, res, next) => {
  const id = req.body.id;
  let tagIds = [];
  let patchedTask;

  knex('tasks').where('id', id).then((array) => {
    if (!array.length) {
      throw boom.notFound();
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
    patchedTask = camelizeKeys(array[0]);

    if (!tags.length) {
      return res.send(patchedTask);
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

    const rows = decamelizeKeys(tagIds.map(tagId => {
      return { tagId, taskId: patchedTask.id }
    }));

    return knex('tasks_tags').insert(rows, '*');
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
