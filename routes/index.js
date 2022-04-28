var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// 登入頁面 [Google]
router.get('/login', function (req, res, next) {
  res.render('auth');
});

// 後端之 Google 登入成功頁面
router.get('/login-google-success', function (req, res, next) {
  console.log('Google User', req.user)
  res.render('login-success', {
    type: 'Google',
    userName: req.user.name
  });
});

// 後端之 Google 登入失敗頁面
router.get('/login-google-fail', function (req, res, next) {
  res.render('login-fail', {
    type: 'Google',
  });
});

module.exports = router;
