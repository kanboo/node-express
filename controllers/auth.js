const { successResponse, errorResponse } = require('../utils/responseHandle')

// 前端打 API 取得 Google 登入資訊
exports.getGoogleAuthByFrontend = async (req, res, next) => {
  //引入官方的套件
  const { OAuth2Client } = require('google-auth-library')
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const client = new OAuth2Client(CLIENT_ID)
  const token = req.body.id_token

  //將token和client_Id放入參數一起去做驗證
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  })

  //拿到的ticket就是換回來的使用者資料
  console.log(ticket)

  //以下就個人需求看要拿資料做哪些使用
  //ex 使用者資訊存入資料庫，把資料存到 session內 等等
  successResponse(res, 200, ticket)
}
