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

router.get('/list', auth, (req, res, next) => {
  knex('tasks').innerJoin('tasks_tags', 'tasks.id', 'tasks_tags.task_id')
    .where('tasks.user_id', req.claim.id).then((array) => {
      console.log(array);
      // camelizeKeys(array).map((obj) => {
      //   delete obj.createdAt;
      //   delete obj.updatedAt;
      //   obj.tags = [];
      //
      //   return obj;
      // })

    })
});

module.exports = router;
