// Third Party Kit
const bcrypt = require('bcrypt')

// Models
const User = require('../models/user')

// Services
const generateJWT = require('../services/generateJWT.js')

// Utils
const handleErrorAsync = require('../utils/handleErrorAsync')
const { successResponse, errorResponse } = require('../utils/responseHandle')

const apiErrorTypes = require('../constants/apiErrorTypes')

/**
 * 註冊
 */
exports.register = handleErrorAsync(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.findOne({ email })
  if (user) { return errorResponse(res, 400, '此 Mail 已註冊！', apiErrorTypes.EMAIL_EXISTS) }

  // 加密密碼
  const hashPassword = await bcrypt.hash(password, 12)

  // 建立新 user
  const newUser = await User.create({ name, email, password: hashPassword })

  const token = generateJWT({
    id: newUser._id,
    name: newUser.name,
  })

  successResponse(res, 200, {
    token,
    user: {
      name: newUser.name,
      photo: newUser.photo,
    },
  })
})

/**
 * 登入
 */
exports.login = handleErrorAsync(async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }, { _id: 1, name: 1, password: 1, photo: 1 })
  if (!user) { return errorResponse(res, 400, '帳號密碼有誤！') }

  const isValidated = await bcrypt.compare(password, user.password)
  if (!isValidated) { return errorResponse(res, 400, '帳號密碼有誤！') }

  const token = generateJWT({
    id: user._id,
    name: user.name,
  })

  successResponse(res, 200, {
    token,
    user: {
      name: user.name,
      photo: user.photo,
    },
  })
})
