const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      require: ['true', '貼文 ID 未填寫'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: ['true', '使用者 ID 未填寫'],
    },
    comment: {
      type: String,
      required: [true, '留言未填寫'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'comments',
  },
)

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'id name photo createdAt',
  })

  next()
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
