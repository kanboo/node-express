const { body } = require('express-validator')

const createPost = [body('content').notEmpty().withMessage('內文需必填！')]

const updatePost = [body('content').notEmpty().withMessage('內文需必填！')]

module.exports = {
  createPost,
  updatePost,
}
