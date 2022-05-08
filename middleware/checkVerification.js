const { validationResult } = require('express-validator')

module.exports = (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: '驗證失敗',
      errors: errors.array(),
    })
  }

  next()
}
