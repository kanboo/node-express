const express = require('express')
const router = express.Router()

const authenticationAndGetUser = require('../middleware/authenticationAndGetUser')

const authValidation = require('../validations/auth')
const userValidation = require('../validations/user')
const postValidation = require('../validations/post')
const imageValidation = require('../validations/image')

/**
 * Image 圖片管理
 */
const ImageController = require('../controllers/image')

router.post(
  '/image',
  authenticationAndGetUser,
  imageValidation.upload.single('image'),
  imageValidation.checkImageValidate,
  ImageController.createImage,
)

/**
 * 註冊 & 登入
 */
const AuthController = require('../controllers/auth')

router.post('/auth/register', authValidation.register, AuthController.register)
router.post('/auth/login', authValidation.login, AuthController.login)

/**
 * User 使用者
 */
const UserController = require('../controllers/user')

router
  .route('/user/profile')
  .get(authenticationAndGetUser, UserController.getProfile)
  .patch(authenticationAndGetUser, userValidation.updateUser, UserController.updateProfile)

router.get('/user/profile/:userId', authenticationAndGetUser, UserController.getUser)

router.post('/user/update-password', authenticationAndGetUser, userValidation.updatePassword, UserController.updatePassword)

router.get('/user/like-posts', authenticationAndGetUser, UserController.getLikePosts)

router.get('/user/follow-list', authenticationAndGetUser, UserController.getFollowList)

router
  .route('/user/follow/:followId')
  .post(authenticationAndGetUser, UserController.appendFollow)
  .delete(authenticationAndGetUser, UserController.deleteFollow)

/**
 * Post 貼文
 */
const PostController = require('../controllers/post')

router
  .route('/posts')
  .get(authenticationAndGetUser, PostController.getPosts)
  .delete(authenticationAndGetUser, PostController.deletePosts)

router.post('/post', authenticationAndGetUser, postValidation.createPost, PostController.createPost)

router
  .route('/post/:postId')
  .delete(authenticationAndGetUser, PostController.deletePost)
  .patch(authenticationAndGetUser, postValidation.updatePost, PostController.updatePost)

router
  .route('/post/:postId/like')
  .post(authenticationAndGetUser, PostController.appendLike)
  .delete(authenticationAndGetUser, PostController.deleteLike)

module.exports = router
