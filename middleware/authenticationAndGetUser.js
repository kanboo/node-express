const jwt = require('jsonwebtoken')

// Models
const User = require('../models/user')

// Utils
const handleErrorAsync = require('../utils/handleErrorAsync')
const { errorResponse } = require('../utils/responseHandle')

module.exports = handleErrorAsync(async (req, res, next) => {
  // 取得 Token
  const authorization = req.headers?.authorization ?? ''
  const token = authorization?.split(' ')?.[1] ?? ''

  if (!(authorization.startsWith('Bearer') && token)) {
    return errorResponse(res, 401, 'Unauthorized')
  }

  // 驗證 Token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        // Errors & Codes
        // ref：https://www.npmjs.com/package/jsonwebtoken#errors--codes

        // 無效的 Token
        if (err.name === 'JsonWebTokenError') {
          return errorResponse(res, 401, 'Unauthorized')
        }

        // 使用期限過期
        if (err.name === 'TokenExpiredError') {
          return errorResponse(res, 401, '權限過期，請重新登入！')
        }

        // JWT 未生效
        if (err.name === 'NotBeforeError') {
          return errorResponse(res, 401, '權限未生效，請洽管理員！')
        }

        console.error('JWT Error', token)
        console.error(err.message)
        return errorResponse(res, 401, 'Unauthorized')
      } else {
        resolve(payload)
      }
    })
  })

  // 取得 User
  const userId = decoded?.id ?? ''
  const user = await User.findById(userId)

  if (!user) {
    return errorResponse(res, 401, '登入失敗！')
  }

  req.user = user

  next()
})
