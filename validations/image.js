const multer = require('multer')
const httpStatus = require('http-status')

const ApiError = require('../utils/ApiError')

const upload = multer({
  limits: {
     // 限制上傳檔案的大小為 2MB
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter (req, file, cb) {
     // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please upload an image'))
    }

     // Success
    cb(null, true)
  },
})

const checkImageValidate = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    // ref：https://github.com/expressjs/multer/blob/4f4326a6687635411a69d70f954f48abb4bce58a/lib/multer-error.js#L3-L12

    return next(new ApiError(httpStatus.BAD_REQUEST, error.message))
  } else if (error) {
    // An unknown error occurred when uploading.
    console.error(error)
    return next(new ApiError(httpStatus.BAD_REQUEST, '圖片上傳失敗'))
  }
}

module.exports = {
  upload,
  checkImageValidate,
}
