'use strict';

const knex = require('../knex');
const jwt = require('jsonwebtoken');

const { camelizeKeys, decamelizeKeys } = require('humps');

const express = require('express');
const router = express.Router();

const auth = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return next(err)
    }

    req.claim = payload;

    next();
  })
}

router.post('/list', auth, (req, res, next) => {
  res.send('ok!');

})

router.get('/list', auth, (req, res, next) => {
  knex('tasks').select('id', 'user_id', 'task_name', 'completed_at')
    .where('tasks.user_id', req.claim.userId).then((array) => {
      const promises = camelizeKeys(array).map((obj) => {
        return knex('tasks_tags')
          .innerJoin('tags', 'tasks_tags.tag_id', 'tags.id')
          .where('tasks_tags.task_id', obj.id)
          .then((array) => {
            obj.tags = camelizeKeys(array).map((tag) => tag.tagName)
            return obj;
          });
      });

      return Promise.all(promises);
    }).then((data) => {
      res.send(data);
    })
    .catch(err=> next(err));
});

router.post('/list', auth, (req, res, next) => {
  res.send('ok!');

})
module.exports = router;
