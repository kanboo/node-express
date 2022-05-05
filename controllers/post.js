const Post = require('../models/post')
const { successResponse, errorResponse } = require('../utils/responseHandle')

require('../models/user')

exports.getPosts = async (req, res, next) => {
  try {
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
    const q = req.query.keyword !== undefined ? { content: new RegExp(req.query.keyword) } : {}
    const posts = await Post
      .find(q)
      .populate({
        path: 'user',
        select: 'name photo',
      }).sort(timeSort)

    successResponse(res, 200, posts)
  } catch (e) {
    console.error(e)
    errorResponse(res, 400, '取得 Posts 有誤')
  }
}

exports.createPost = async (req, res, next) => {
  try {
    const { user, content, image } = req.body

    if (!user || !content) {
      errorResponse(res, 400, '使用者及內文需必填！')
      return
    }

    await Post.create({ user, content, image })

    const posts = await Post.find()
    successResponse(res, 200, posts)
  } catch (e) {
    console.error(e)
    errorResponse(res, 400, '建立 Post 有誤')
  }
}
exports.deletePosts = async (req, res, next) => {
  try {
    await Post.deleteMany({})
    successResponse(res, 200, [])
  } catch (e) {
    console.error(e)
    errorResponse(res, 400, '刪除 Posts 有誤')
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId
    const result = await Post.findByIdAndDelete(postId)

    if (result) {
      const posts = await Post.find()
      successResponse(res, 200, posts)
    } else {
      errorResponse(res, 400, '查無 Post')
    }
  } catch (e) {
    console.error(e)
    errorResponse(res, 400, '刪除 Post 有誤')
  }
}
exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId
    const { content } = req.body

    if (!content) {
      errorResponse(res, 400, '內文需必填！')
      return
    }

    const result = await Post.findByIdAndUpdate(postId, { content })

    if (result) {
      const posts = await Post.find()
      successResponse(res, 200, posts)
    } else {
      errorResponse(res, 400, '查無 Post')
    }
  } catch (e) {
    console.error(e)
    errorResponse(res, 400, '更新 Post 有誤')
  }
}
