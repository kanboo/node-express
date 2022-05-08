const express = require('express')
const router = express.Router()

const { body } = require('express-validator')

const checkVerification = require('../middleware/checkVerification')

const PostController = require('../controllers/post')

router.get('/', PostController.getPosts)

router.post(
  '/',
  [body('content').notEmpty().withMessage('內文需必填！')],
  checkVerification,
  PostController.createPost,
)

router.delete('/', PostController.deletePosts)

router.delete('/:postId', PostController.deletePost)

router.patch(
  '/:postId',
  [body('content').notEmpty().withMessage('內文需必填！')],
  checkVerification,
  PostController.updatePost,
)

module.exports = router
