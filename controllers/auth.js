// Third Party Kit
const bcrypt = require('bcrypt')
const httpStatus = require('http-status')

// Models
const User = require('../models/user')

// Services
const generateJWT = require('../services/generateJWT')
const { registerSuccessMail } = require('../services/mailTransporter')

// Utils
const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')
const { successResponse } = require('../utils/responseHandle')

const apiErrorTypes = require('../constants/apiErrorTypes')

/**
 * 註冊
 */
const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.findOne({ email })
  if (user) {
    const apiError = new ApiError(httpStatus.BAD_REQUEST, '此帳號已註冊')
    apiError.setErrorType(apiErrorTypes.USER_ALREADY_EXISTS)
    return next(apiError)
  }

  // 加密密碼
  const hashPassword = await bcrypt.hash(password, 12)

  // 建立新 user
  const newUser = await User.create({ name, email, password: hashPassword })

  const token = generateJWT({
    id: newUser._id,
    name: newUser.name,
  })

  // 註冊成功通知信
  registerSuccessMail(email)

  successResponse(res, 200, {
    token,
    user: newUser,
  })
})

/**
 * 登入
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  let user = await User.findOne({ email }).select('+password')
  if (!user) { return next(new ApiError(httpStatus.BAD_REQUEST, '帳號密碼有誤！')) }

  const isValidated = await bcrypt.compare(password, user.password)
  if (!isValidated) { return next(new ApiError(httpStatus.BAD_REQUEST, '帳號密碼有誤！')) }

  const token = generateJWT({
    id: user._id,
    name: user.name,
  })

  /**
   * 清除密碼紀錄
   * Note: 需要先把 Mongoose 資料轉為 object 才能使用 object 相關操作。
   */
  user = user.toObject()
  delete user.password

  successResponse(res, 200, {
    token,
    user,
  })
})

/**
 * 第三方登入
 */
const passportLogin = catchAsync(async (req, res, next) => {
  const token = generateJWT({
    id: req.user._id,
    name: req.user.name,
  })

  // 重新導向到前端
  res.redirect(`${process.env.FORENTEND_HOST}/auth/callback?token=${token}&name=${req.user.name}`)
})

/**
 * 前端打 API 取得 Google 登入資訊
 */
const getGoogleAuthByFrontend = catchAsync(async (req, res, next) => {
  // 引入官方的套件
  const { OAuth2Client } = require('google-auth-library')
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const client = new OAuth2Client(CLIENT_ID)
  const token = req.body.id_token

  // 將token和client_Id放入參數一起去做驗證
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  })

  // 拿到的ticket就是換回來的使用者資料
  console.log('getGoogleAuthByFrontend', ticket)

  // 以下就個人需求看要拿資料做哪些使用
  // ex 使用者資訊存入資料庫，把資料存到 session內 等等
  successResponse(res, 200, ticket)
})

module.exports = {
  register,
  login,
  passportLogin,
  getGoogleAuthByFrontend,
}
