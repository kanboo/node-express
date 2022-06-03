const crypto = require('crypto')

const getRandomHashName = (originalName) => (
  crypto
    . createHash('sha256')
    .update(originalName + crypto.randomInt(0, 9999999))
    .digest('hex')
)

module.exports = getRandomHashName
