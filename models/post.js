const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, '使用者名稱必填']
    },
    userPhoto: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      required: [true, '內容必填']
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'posts'
  }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
