var express = require('express');
var router = express.Router();

const passport = require('passport')

// 引入 passport 設定
require('../utils/passportGoogle')

const AuthController = require('../controllers/auth')

// 籍由 前端 取得 Google 登入資訊
router.post('/google', AuthController.getGoogleAuthByFrontend);

// 籍由 後端 取得 Google 登入資訊
router.get('/google/backend', passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/login-google-success',
  failureRedirect: '/login-google-fail'
}));

module.exports = router;
