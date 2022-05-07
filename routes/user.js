const express = require('express')
const router = express.Router()

const { body } = require('express-validator')
const checkVerification = require('../middleware/checkVerification')

const UserController = require('../controllers/user')

/**
 * 註冊
 */
const registerValidateRule = [
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
        throw new Error('Password invalid')
      }
      return true
    }),
]

router.post(
  '/register',
  registerValidateRule,
  checkVerification,
  UserController.register,
)

module.exports = router
