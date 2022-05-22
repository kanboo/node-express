// Third Party Kit
const bcrypt = require('bcrypt')

// Models
const User = require('../models/user')

// Services
const generateJWT = require('../services/generateJWT.js')

// Utils
const catchAsync = require('../utils/catchAsync')
const { successResponse, errorResponse } = require('../utils/responseHandle')

const apiErrorTypes = require('../constants/apiErrorTypes')

/**
 * 註冊
 */
const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.findOne({ email })
  if (user) { return errorResponse(res, 400, '此 Mail 已註冊！', apiErrorTypes.EMAIL_EXISTS) }

  // 加密密碼
  const hashPassword = await bcrypt.hash(password, 12)

  // 建立新 user
  const newUser = await User.create({ name, email, password: hashPassword })

  const token = generateJWT({
    id: newUser._id,
    name: newUser.name,
  })

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

  const user = await User.findOne({ email }).select('+password')
  if (!user) { return errorResponse(res, 400, '帳號密碼有誤！') }

  const isValidated = await bcrypt.compare(password, user.password)
  if (!isValidated) { return errorResponse(res, 400, '帳號密碼有誤！') }

  const token = generateJWT({
    id: user._id,
    name: user.name,
  })

  successResponse(res, 200, {
    token,
    user,
  })
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
  getGoogleAuthByFrontend,
}
