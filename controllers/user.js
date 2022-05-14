// Third Party Kit
const bcrypt = require('bcrypt')

// Models
const User = require('../models/user')

// Services
const generateJWT = require('../services/generateJWT.js')

// Utils
const handleErrorAsync = require('../utils/handleErrorAsync')
const { successResponse, errorResponse } = require('../utils/responseHandle')

const apiErrorTypes = require('../constants/apiErrorTypes')

// 過濾 User 資料，只回傳部份資料
const filteredUserInfo = (user) => {
  return {
    id: user?._id,
    name: user?.name,
    photo: user?.photo,
    gender: user?.gender,
  }
}

/**
 * 註冊
 */
exports.register = handleErrorAsync(async (req, res, next) => {
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
    user: filteredUserInfo(newUser),
  })
})

/**
 * 登入
 */
exports.login = handleErrorAsync(async (req, res, next) => {
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
    user: filteredUserInfo(user),
  })
})

/**
 * 取得 User 資訊
 */
exports.getProfile = handleErrorAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const user = filteredUserInfo(req.user)

  successResponse(res, 200, user)
})

/**
 * 更新 User 資訊
 */
exports.updateProfile = handleErrorAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user?._id

  const { name, photo, gender } = req.body

  // 更新資料
  const newUser = await User.updateOne({ _id: userId }, { $set: { name, photo, gender } })
  if (!newUser) { return errorResponse(res, 400, '更新失敗！') }

  const user = await User.findById(userId)

  successResponse(res, 200, filteredUserInfo(user))
})

/**
 * 更新 User 密碼
 */
exports.updatePassword = handleErrorAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user?._id

  const { newPassword } = req.body

  // 加密密碼
  const hashPassword = await bcrypt.hash(newPassword, 12)

  // 更新密碼
  await User.findByIdAndUpdate(userId, { password: hashPassword })

  successResponse(res, 200, { success: true })
})
