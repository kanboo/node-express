const { body } = require('express-validator')

const validate = require('../services/validate')

const createPost = validate([body('content').notEmpty().withMessage('內文需必填！')])

const updatePost = validate([body('content').notEmpty().withMessage('內文需必填！')])

module.exports = {
  createPost,
  updatePost,
}
