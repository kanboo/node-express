const Post = require('../models/post')
const { successResponse, errorResponse } = require('../utils/responseHandle')


exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
    successResponse(res, 200, posts)
  } catch (e) {
    console.error(e)
    errorResponse(res, 400, '取得 Posts 有誤')
  }
}

exports.createPost = async (req, res, next) => {
  try {
    const { userName, userPhoto, content } = req.body;

    if (!userName || !content) {
      errorResponse(res, 400, "使用者名稱及內文需必填！");
      return
    }

    await Post.create({ userName, userPhoto, content });

    const posts = await Post.find();
    successResponse(res, 200, posts);
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
    const { content } = req.body;

    if (!content) {
      errorResponse(res, 400, "內文需必填！");
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