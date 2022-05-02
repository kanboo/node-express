const { ImgurClient } = require('imgur');
const client = new ImgurClient({ accessToken: process.env.IMGUR_ACCESS_TOKEN })
const { successResponse, errorResponse } = require('../utils/responseHandle')

exports.createImage = async (req, res, next) => {
  if (!req.files) {
    errorResponse(res, 400, 'No File Selected')
  } else {
    var imageFile = req.files.image;

    try {
      const response = await client.upload({
        image: Buffer.from(imageFile.data).toString('base64'),
        type: "base64"
      });

      successResponse(res, 200, { link: response.data.link })
    } catch (error) {
      errorResponse(res, 400, 'Upload image fail')
    }
  }
}