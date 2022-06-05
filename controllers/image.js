const sizeOf = require('image-size')
const httpStatus = require('http-status')

const GCS = require('../services/googleCloudStorage')
const IMGUR = require('../services/imgur')

const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')
const getRandomHashName = require('../utils/randomHashName')
const { successResponse } = require('../utils/responseHandle')

/**
 * 建立圖片
 */
exports.createImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'No File Selected'))
  } else {
    try {
      const imageFile = req.file
      const { type } = req.query

      const randomHashName = getRandomHashName(imageFile.originalname)
      const imageName = `${randomHashName}.${imageFile.mimetype.split('/')[1]}`

      // 若是頭像的話，多加一個長寬比例的檢查
      if (type === 'avatar') {
        const dimensions = sizeOf(imageFile.buffer)
        if (!(dimensions.width === dimensions.height && dimensions.height >= 300)) {
          return next(new ApiError(httpStatus.BAD_REQUEST, '圖片寬高比必需為 1:1 且 解析度寬度至少 300像素以上，請重新上傳'))
        }

        // 多上傳一份至 GCS
        const imageUrl = await GCS.uploadFromBuffer(imageFile.buffer, imageName)
        console.log('GCS_URL', imageUrl)
      }

      const response = await IMGUR.uploadFromBuffer(imageFile.buffer)

      successResponse(res, 200, { link: response.data.link })
    } catch (error) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Upload image fail'))
    }
  }
})
