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
  const data = [{
    id: 1,
    name: 'Pick up dog food',
    completedAt: null,
    tags: ['home', 'pet care']
  }, {
    id: 2,
    name: 'Homework',
    completedAt: new Date('2017-01-11 00:00:00 PST'),
    tags: ['work']
  }, {
    id: 3,
    name: 'Mow lawn',
    completedAt: null,
    tags: ['home', 'gardening']
  }, {
    id: 4,
    name: 'Costco trip',
    completedAt: new Date('2017-01-12 00:00:00 PST'),
    tags: []
  }]
  res.send(data)
});

module.exports = router;
