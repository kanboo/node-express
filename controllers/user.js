// Third Party Kit
const bcrypt = require('bcrypt')
const httpStatus = require('http-status')

const Post = require('../models/post')

// Models
const User = require('../models/user')

// Utils
const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')
const { successResponse } = require('../utils/responseHandle')
const checkValidMongoObjectId = require('../utils/checkValidMongoObjectId')

/**
 * 取得 User 資訊
 */
const getProfile = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊

  successResponse(res, 200, req.user)
})

/**
 * 更新 User 資訊
 */
const updateProfile = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user.id

  const { name, photo, gender } = req.body

  // 更新資料
  const newUser = await User.updateOne({ _id: userId }, { $set: { name, photo, gender } })
  if (!newUser) { return next(new ApiError(httpStatus.BAD_REQUEST, '更新失敗')) }

  const user = await User.findById(userId)

  successResponse(res, 200, user)
})

/**
 * 取得指定 User 資訊
 */
const getUser = catchAsync(async (req, res, next) => {
  // 取得 User
  const userId = req.params.userId

  if (!checkValidMongoObjectId(userId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, '取得 User 有誤'))
  }

  const user = await User.findById(userId)
    .populate({
      path: 'following.user',
      select: '_id',
    })
    .populate({
      path: 'followers.user',
      select: '_id name',
    })

  if (user) {
    successResponse(res, 200, user)
  } else {
    return next(new ApiError(httpStatus.BAD_REQUEST, '查詢失敗！'))
  }
})

/**
 * 更新 User 密碼
 */
const updatePassword = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user.id

  const { newPassword } = req.body

  // 加密密碼
  const hashPassword = await bcrypt.hash(newPassword, 12)

  // 更新密碼
  await User.findByIdAndUpdate(userId, { password: hashPassword })

  successResponse(res, 200, { success: true })
})

/**
 * 取得已按讚的貼文清單
 */
const getLikePosts = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user.id

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
    return next(new ApiError(httpStatus.BAD_REQUEST, '查詢失敗！'))
  }
})

/**
 * 新增 Follow 人員
 */
const appendFollow = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user.id
  const followId = req.params.id

  if (!checkValidMongoObjectId(followId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'User follow 有誤'))
  }

  if (userId === followId) {
    return next(new ApiError(httpStatus.BAD_REQUEST, '無法追蹤自己'))
  }

  /**
   * Using Mongoose / MongoDB $addToSet functionality on array of objects
   * ref: https://stackoverflow.com/a/33577318
   */
  await User.updateOne(
    {
      _id: userId,
      'following.user': { $ne: followId },
    },
    {
      $push: { following: { user: followId } },
    },
  )
  await User.updateOne(
    {
      _id: followId,
      'followers.user': { $ne: userId },
    },
    {
      $push: { followers: { user: userId } },
    },
  )

  successResponse(res, 200, { success: true })
})

/**
 * 刪除 Follow 人員
 */
const deleteFollow = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user.id
  const followId = req.params.id

  if (!checkValidMongoObjectId(followId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'User follow 有誤'))
  }

  if (userId === followId) {
    return next(new ApiError(httpStatus.BAD_REQUEST, '無法追蹤自己'))
  }

  await User.updateOne(
    { _id: userId },
    { $pull: { following: { user: followId } } },
  )
  await User.updateOne(
    { _id: followId },
    { $pull: { followers: { user: userId } } },
  )

  successResponse(res, 200, { success: true })
})

/**
 * 取得已 Follow 人員清單
 */
const getFollowingList = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user.id

  const user = await User.findById(userId)
    .populate({
      path: 'following.user',
      select: '_id name photo',
    })

  const normalizedFollowing = user.following.map((follower) => {
    const { _id, name, photo } = follower.user
    return {
      _id,
      name,
      photo,
      createdAt: follower.createdAt,
    }
  })

  if (user) {
    successResponse(res, 200, normalizedFollowing)
  } else {
    return next(new ApiError(httpStatus.BAD_REQUEST, '查詢失敗！'))
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
  getFollowingList,
}
