const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '使用者 ID 未填寫'],
    },
    content: {
      type: String,
      required: [true, '內容未填寫'],
    },
    image: {
      type: String,
      default: '',
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'posts',
  },
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
