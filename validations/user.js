const { body } = require('express-validator')

/**
 * 註冊
 */
const register = [
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

/**
 * 登入
 */
const login = [
  body('email')
    .isEmail()
    .notEmpty()
    .withMessage('Email invalid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password invalid'),
]

/**
 * 更新 User
 */
const updateUser = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name invalid'),
  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender invalid')
    .isIn(['male', 'female'])
    .withMessage('Gender invalid, male or female'),
]

/**
 * 更新 Password
 */
const updatePassword = [
  body('newPassword')
    .trim()
    .isLength({ min: 4 })
    .withMessage('NewPassword invalid'),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password invalid')
      }
      return true
    }),
]

module.exports = {
  register,
  login,
  updateUser,
  updatePassword,
}
