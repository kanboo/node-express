const { ImgurClient } = require('imgur')
const client = new ImgurClient({
  clientId: process.env.IMGUR_CLIENTID,
  clientSecret: process.env.IMGUR_CLIENT_SECRET,
  refreshToken: process.env.IMGUR_REFRESH_TOKEN,
})
const catchAsync = require('../utils/catchAsync')
const { successResponse, errorResponse } = require('../utils/responseHandle')

/**
 * 建立圖片
 */
exports.createImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    errorResponse(res, 400, 'No File Selected')
  } else {
    const imageFile = req.file

    try {
      const response = await client.upload({
        image: Buffer.from(imageFile.buffer).toString('base64'),
        type: 'base64',
        album: process.env.IMGUR_ALBUM_ID,
      })

      successResponse(res, 200, { link: response.data.link })
    } catch (error) {
      errorResponse(res, 400, 'Upload image fail')
    }
  }
})
