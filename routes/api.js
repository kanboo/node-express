const express = require('express')
const router = express.Router()

const checkVerification = require('../middleware/checkVerification')
const authenticationAndGetUser = require('../middleware/authenticationAndGetUser')

const { errorResponse } = require('../utils/responseHandle')

const userValidation = require('../validations/user')
const postValidation = require('../validations/post')

/**
 * Image 圖片管理
 */
const ImageController = require('../controllers/image')

const multer = require('multer')
const upload = multer({
  limits: {
     // 限制上傳檔案的大小為 1MB
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter (req, file, cb) {
     // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please upload an image'))
    }

     // Success
    cb(null, true)
  },
})

router.post(
  '/image',
  authenticationAndGetUser,
  upload.single('image'),
  (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      // ref：https://github.com/expressjs/multer/blob/4f4326a6687635411a69d70f954f48abb4bce58a/lib/multer-error.js#L3-L12

      return errorResponse(res, 400, error.message, error.code)
    } else if (error) {
      // An unknown error occurred when uploading.
      console.error(error)
      return errorResponse(res, 400, '圖片上傳失敗')
    }
  },
  ImageController.createImage,
)

/**
 * User 使用者
 */
const UserController = require('../controllers/user')

router.post('/user/register', userValidation.register, checkVerification, UserController.register)
router.post('/user/login', userValidation.login, checkVerification, UserController.login)

router
  .route('/user/profile')
  .get(authenticationAndGetUser, UserController.getProfile)
  .patch(authenticationAndGetUser, userValidation.updateUser, checkVerification, UserController.updateProfile)

router.patch('/user/update-password', authenticationAndGetUser, userValidation.updatePassword, checkVerification, UserController.updatePassword)

/**
 * Post 貼文
 */
const PostController = require('../controllers/post')

router
  .route('/posts')
  .get(authenticationAndGetUser, PostController.getPosts)
  .delete(authenticationAndGetUser, PostController.deletePosts)

router.post('/post', authenticationAndGetUser, postValidation.createPost, checkVerification, PostController.createPost)

router
  .route('/post/:postId')
  .delete(authenticationAndGetUser, PostController.deletePost)
  .patch(authenticationAndGetUser, postValidation.updatePost, checkVerification, PostController.updatePost)

module.exports = router
