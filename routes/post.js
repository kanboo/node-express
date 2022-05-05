const express = require('express')
const router = express.Router()

const PostController = require('../controllers/post')

router.get('/', PostController.getPosts)
router.post('/', PostController.createPost)
router.delete('/', PostController.deletePosts)

router.delete('/:postId', PostController.deletePost)
router.patch('/:postId', PostController.updatePost)

module.exports = router
