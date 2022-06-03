const { ImgurClient } = require('imgur')

const client = new ImgurClient({
  clientId: process.env.IMGUR_CLIENTID,
  clientSecret: process.env.IMGUR_CLIENT_SECRET,
  refreshToken: process.env.IMGUR_REFRESH_TOKEN,
})

const uploadFromBuffer = (buffer) => client.upload({
  image: Buffer.from(buffer).toString('base64'),
  type: 'base64',
  album: process.env.IMGUR_ALBUM_ID,
})

module.exports = {
  uploadFromBuffer,
}
