const { body } = require('express-validator')

const validate = require('../services/validate')

/**
 * 更新 User
 */
const updateUser = validate([
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
])

/**
 * 更新 Password
 */
const updatePassword = validate([
  body('newPassword')
    .trim()
    .isLength({ min: 4 })
    .withMessage('NewPassword invalid'),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('ConfirmPassword invalid')
      }
      return true
    }),
])

module.exports = {
  updateUser,
  updatePassword,
}
