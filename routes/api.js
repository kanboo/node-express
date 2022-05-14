const express = require('express')
const router = express.Router()

const { body } = require('express-validator')

const checkVerification = require('../middleware/checkVerification')
const authenticationAndGetUser = require('../middleware/authenticationAndGetUser')

const { errorResponse } = require('../utils/responseHandle')

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

// 註冊
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
  '/user/register',
  registerValidateRule,
  checkVerification,
  UserController.register,
)

// 登入
const loginValidateRule = [
  body('email')
    .isEmail()
    .notEmpty()
    .withMessage('Email invalid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password invalid'),
]

router.post(
  '/user/login',
  loginValidateRule,
  checkVerification,
  UserController.login,
)

// 取得 User 資訊
router.get(
  '/user/profile',
  authenticationAndGetUser,
  UserController.getProfile,
)

const profileValidateRule = [
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

router.patch(
  '/user/profile',
  authenticationAndGetUser,
  profileValidateRule,
  checkVerification,
  UserController.updateProfile,
)

const passwordValidateRule = [
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
router.patch(
  '/user/update-password',
  authenticationAndGetUser,
  passwordValidateRule,
  checkVerification,
  UserController.updatePassword,
)

/**
 * Post 貼文
 */
const PostController = require('../controllers/post')

router.get(
  '/posts',
  authenticationAndGetUser,
  PostController.getPosts,
)

router.delete(
  '/posts',
  authenticationAndGetUser,
  PostController.deletePosts,
)

router.post(
  '/post',
  authenticationAndGetUser,
  [body('content').notEmpty().withMessage('內文需必填！')],
  checkVerification,
  PostController.createPost,
)

router.delete(
  '/post/:postId',
  authenticationAndGetUser,
  PostController.deletePost,
)

router.patch(
  '/post/:postId',
  authenticationAndGetUser,
  [body('content').notEmpty().withMessage('內文需必填！')],
  checkVerification,
  PostController.updatePost,
)

module.exports = router
