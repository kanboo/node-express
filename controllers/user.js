// Third Party Kit
const bcrypt = require('bcrypt')

const Post = require('../models/post')

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

const getUser = catchAsync(async (req, res, next) => {
  // 取得 User
  const userId = req.params.userId
  const user = await User.findById(userId)

  if (user) {
    successResponse(res, 200, filteredUserInfo(user))
  } else {
    errorResponse(res, 400, '查詢失敗！')
  }
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

const getLikePosts = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user?._id

  const posts = (
    await Post
      .find({ likes: { $in: [userId] } })
      .populate({
        path: 'user',
        select: 'name photo',
      })
  )

  if (posts) {
    successResponse(res, 200, posts)
  } else {
    errorResponse(res, 400, '查詢失敗！')
  }
})

const appendFollow = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user?._id
  const followId = req.params.followId

  const user = await User.findByIdAndUpdate(followId, { $addToSet: { follows: userId } }, { new: true })

  if (user) {
    successResponse(res, 200, filteredUserInfo(user))
  } else {
    errorResponse(res, 400, 'User follow 新增失敗')
  }
})
const deleteFollow = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user?._id
  const followId = req.params.followId

  const user = await User.findByIdAndUpdate(followId, { $pull: { follows: userId } }, { new: true })

  if (user) {
    successResponse(res, 200, filteredUserInfo(user))
  } else {
    errorResponse(res, 400, 'User follow 刪除失敗')
  }
})

const getFollowList = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user?._id

  const users = await User.find({ follows: { $in: [userId] } })

  if (users) {
    successResponse(res, 200, users)
  } else {
    errorResponse(res, 400, '查詢失敗！')
  }
})

module.exports = {
  getProfile,
  updateProfile,
  getUser,
  updatePassword,
  getLikePosts,
  appendFollow,
  deleteFollow,
  getFollowList,
}
