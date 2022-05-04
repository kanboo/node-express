const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    password: {
      type: String,
      required: [true, '請輸入您的 Password'],
      select: false
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'users'
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User
