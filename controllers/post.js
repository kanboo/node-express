const httpStatus = require('http-status')

const Post = require('../models/post')
const Comment = require('../models/comment')

const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')
const { successResponse } = require('../utils/responseHandle')
const checkValidMongoObjectId = require('../utils/checkValidMongoObjectId')

require('../models/user')

/**
 * 依條件取得符合資格貼文清單
 */
const getPosts = catchAsync(async (req, res, next) => {
  const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
  const q = {}

  if (req.query.keyword !== undefined) {
    q.content = new RegExp(req.query.keyword)
  }
  if (req.query.user !== undefined) {
    q.user = req.query.user
  }

  const { page = 1, perPage = 10 } = req.query
  const hasQueryAll = !!req.query.all

  const options = {
    pagination: !hasQueryAll,
    page,
    limit: perPage,
    populate: [
      {
        path: 'user',
        select: 'name photo',
      },
      {
        path: 'comments',
        select: 'comment user createdAt',
      },
    ],
    sort: timeSort,
  }

  const response = await Post.paginate(q, options)
  successResponse(res, 200, response)
})

/**
 * 取得單一貼文
 */
const getPost = catchAsync(async (req, res, next) => {
  const postId = req.params.postId

  const posts = await Post
    .findById(postId)
    .populate({
      path: 'user',
      select: 'name photo',
    })
    .populate({
      path: 'comments',
      select: 'comment user createdAt',
    })

  if (posts) {
    successResponse(res, 200, posts)
  } else {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Posts 取得失敗'))
  }
})

/**
 * 新增貼文
 */
const createPost = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user.id

  const { content, image } = req.body

  const newPost = await Post.create({ user: userId, content, image })

  if (newPost) {
    successResponse(res, 200, { id: newPost._id })
  } else {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Post 建立失敗'))
  }
})

/**
 * 刪除所有貼文
 */
const deletePosts = catchAsync(async (req, res, next) => {
  const result = await Post.deleteMany({})
  const isSucceeded = result?.acknowledged ?? false

  if (isSucceeded) {
    successResponse(res, 200, { success: true })
  } else {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Posts 刪除失敗'))
  }
})

/**
 * 刪除指定貼文
 */
const deletePost = catchAsync(async (req, res, next) => {
  const postId = req.params.postId
  const post = await Post.findByIdAndDelete(postId)

  if (!checkValidMongoObjectId(postId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Posts 刪除有誤'))
  }

  if (post) {
    successResponse(res, 200, { success: true })
  } else {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Post 刪除失敗'))
  }
})

/**
 * 更新貼文
 */
const updatePost = catchAsync(async (req, res, next) => {
  const postId = req.params.postId
  const { content } = req.body

  if (!checkValidMongoObjectId(postId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Post 更新有誤'))
  }

  const post = await Post.findByIdAndUpdate(postId, { content })

  if (post) {
    successResponse(res, 200, { success: true })
  } else {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Post 更新失敗'))
  }
})

/**
 * 新增點讚紀錄
 */
const appendLike = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user.id
  const postId = req.params.postId

  if (!checkValidMongoObjectId(postId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Post Like 有誤'))
  }

  const post = (
    await Post
      .findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true })
      .populate({
        path: 'user',
        select: 'name photo',
      })
  )

  if (post) {
    successResponse(res, 200, post)
  } else {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Post Like 新增失敗'))
  }
})

/**
 * 刪除點讚紀錄
 */
const deleteLike = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user.id
  const postId = req.params.postId

  if (!checkValidMongoObjectId(postId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Post Like 有誤'))
  }

  const post = (
    await Post
      .findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true })
      .populate({
        path: 'user',
        select: 'name photo',
      })
  )

  if (post) {
    successResponse(res, 200, post)
  } else {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Post Like 刪除失敗'))
  }
})

/**
 * 新增點讚紀錄
 */
const createComment = catchAsync(async (req, res, next) => {
  // 已從 Middleware 之 authenticationAndGetUser 取得 User 資訊
  const userId = req.user.id
  const postId = req.params.postId
  const { comment } = req.body

  if (!checkValidMongoObjectId(postId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Post Comment 有誤'))
  }

  const newComment = await Comment.create({
    post: postId,
    user: userId,
    comment,
  })

  if (newComment) {
    successResponse(res, 200, newComment)
  } else {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Post Comment 新增失敗'))
  }
})

module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePosts,
  deletePost,
  updatePost,
  appendLike,
  deleteLike,
  createComment,
}
