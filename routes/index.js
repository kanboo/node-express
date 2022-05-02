var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// 登入頁面
router.get('/login', function (req, res, next) {
  res.render('auth');
});

// 登出頁面
router.post('/logout', function (req, res, next) {
  req.session.destroy(e => {
    if (e) { console.error(e) }
    
    res.redirect('/login')
  })
});

// 後端之 Google 登入成功頁面
router.get('/login-google-success', function (req, res, next) {
  // console.log('Google User', req.user)

  req.session.isLoggedIn = true
  req.session.save(e => {
    if (e) { console.error(e) }

    res.render('login-success', {
      type: 'Google',
      userName: req.user.displayName
    });
  })
});

// 後端之 Google 登入失敗頁面
router.get('/login-google-fail', function (req, res, next) {
  res.render('login-fail', {
    type: 'Google',
  });
});

// 後端之 Facebook 登入成功頁面
router.get('/login-facebook-success', function (req, res, next) {
  // console.log('Facebook User', req.user)

  req.session.isLoggedIn = true
  req.session.save(e => {
    if (e) { console.error(e) }

    res.render('login-success', {
      type: 'Facebook',
      userName: req.user.displayName
    });
  })
});

// 後端之 Facebook 登入失敗頁面
router.get('/login-facebook-fail', function (req, res, next) {
  res.render('login-fail', {
    type: 'Facebook',
  });
});

module.exports = router;
