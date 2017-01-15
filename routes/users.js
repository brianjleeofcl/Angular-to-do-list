'use strict';

const knex = require('../knex');

const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');

const express = require('express');
const router = express.Router();

router.post('/users', (req, res, next) => {
  // let user;
  // const { firstName, lastName, email, password, phone } = req.body;

  console.log(req.body);
  res.send('got it!')
})


module.exports = router;
