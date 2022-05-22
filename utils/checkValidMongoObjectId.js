const mongoose = require('mongoose')

/**
 * 檢查是否為合法的 Mongoose ObjectId
 */
const checkValidMongoObjectId = mongoose.isObjectIdOrHexString

module.exports = checkValidMongoObjectId
