'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    name: Joi.string()
      .label('Name')
      .required()
      .max(50, 'utf8'),

    phone: Joi.string()
      .label('Phone')
      .required()
      .unit('integer')
      .max(10, 'utf8')
      .min(10),

    email: Joi.string()
      .label('Email')
      .required()
      .email()
      .trim(),

    password: Joi.string()
      .label('Password')
      .required()
      .trim()
      .min(8),

    password_verify: Joi.string()
      .label('Password_Verify')
      .required()
      .trim()
      .min(8)
  }
};
