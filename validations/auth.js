const { body } = require('express-validator')

const validate = require('../services/validate')

/**
 * 註冊
 */
const register = validate([
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name invalid'),
  body('email')
    .isEmail()
    .withMessage('Email invalid'),
  body('password')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Password invalid'),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('ConfirmPassword invalid')
      }
      return true
    }),
])

/**
 * 登入
 */
const login = validate([
  body('email')
    .isEmail()
    .notEmpty()
    .withMessage('Email invalid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password invalid'),
])

module.exports = {
  register,
  login,
}
