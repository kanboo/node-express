const express = require('express')
const router = express.Router()

const passport = require('passport')

// 引入 passport 設定
require('../utils/passportGoogle')
require('../utils/passportFacebook')

const AuthController = require('../controllers/auth')

// 籍由 前端 取得 Google 登入資訊
router.post('/google', AuthController.getGoogleAuthByFrontend)

// 籍由 後端 取得 Google 登入資訊
router.get('/google/backend', passport.authenticate('google', { scope: ['profile'] }))
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/login-google-success',
  failureRedirect: '/login-google-fail',
}))

// 籍由 後端 取得 Facebook 登入資訊
router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/login-facebook-success',
  failureRedirect: '/login-facebook-fail',
}))

module.exports = router
