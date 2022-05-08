const Post = require('../models/post')
const handleErrorAsync = require('../utils/handleErrorAsync')
const { successResponse, errorResponse } = require('../utils/responseHandle')

require('../models/user')

exports.getPosts = handleErrorAsync(async (req, res, next) => {
  const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
  const q = req.query.keyword !== undefined ? { content: new RegExp(req.query.keyword) } : {}

  const posts = await Post
    .find(q)
    .populate({
      path: 'user',
      select: 'name photo',
    }).sort(timeSort)

  if (posts) {
    successResponse(res, 200, posts)
  } else {
    errorResponse(res, 400, 'Posts 取得失敗')
  }
})

exports.createPost = handleErrorAsync(async (req, res, next) => {
  const { user, content, image } = req.body

  if (!user || !content) {
    errorResponse(res, 400, '使用者及內文需必填！')
    return
  }

  const newPost = await Post.create({ user, content, image })

  if (newPost) {
    successResponse(res, 200, { id: newPost._id })
  } else {
    errorResponse(res, 400, 'Post 建立失敗')
  }
})

exports.deletePosts = handleErrorAsync(async (req, res, next) => {
  const result = await Post.deleteMany({})
  const isSucceeded = result?.acknowledged ?? false

  if (isSucceeded) {
    successResponse(res, 200, { success: true })
  } else {
    errorResponse(res, 400, 'Posts 刪除失敗')
  }
})

exports.deletePost = handleErrorAsync(async (req, res, next) => {
  const postId = req.params.postId
  const post = await Post.findByIdAndDelete(postId)

  if (post) {
    successResponse(res, 200, { success: true })
  } else {
    errorResponse(res, 400, 'Post 刪除失敗')
  }
})

exports.updatePost = handleErrorAsync(async (req, res, next) => {
  const postId = req.params.postId
  const { content } = req.body

  if (!content) {
    return errorResponse(res, 400, '內文需必填！')
  }

  const post = await Post.findByIdAndUpdate(postId, { content })

  if (post) {
    successResponse(res, 200, { success: true })
  } else {
    errorResponse(res, 400, 'Post 更新失敗')
  }
})
