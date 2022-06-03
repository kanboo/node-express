const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的名字'],
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, '請輸入您的 Password'],
      select: false,
    },
    photo: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    googleId: {
      type: String,
      select: false,
    },
    facebookId: {
      type: String,
      select: false,
    },
    following: [{
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    followers: [{
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'users',
  },
)

const User = mongoose.model('User', userSchema)

module.exports = User
