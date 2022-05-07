const jwt = require('jsonwebtoken')

// 產生 JWT token
module.exports = ({ id = '', name = '' }) => {
  console.log('generateJWT', { id, name })
  const token = jwt.sign(
    { id, name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_DAY },
  )

  return token
}
