// Third Party Kit
const bcrypt = require('bcrypt')

// Models
const User = require('../models/user')

// Utils
const catchAsync = require('../utils/catchAsync')
const { successResponse, errorResponse } = require('../utils/responseHandle')
const filteredUserInfo = require('../utils/filteredUserInfo')

/**
 * 取得 User 資訊
 */
const getProfile = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const user = filteredUserInfo(req.user)

  successResponse(res, 200, user)
})

/**
 * 更新 User 資訊
 */
const updateProfile = catchAsync(async (req, res, next) => {
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
const updatePassword = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user?._id

  const { newPassword } = req.body

  // 加密密碼
  const hashPassword = await bcrypt.hash(newPassword, 12)

  // 更新密碼
  await User.findByIdAndUpdate(userId, { password: hashPassword })

  successResponse(res, 200, { success: true })
})

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
}
