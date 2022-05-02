const express = require('express');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');

// Mail
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.MAILER_ACCOUNT,
    pass: process.env.MAILER_PASSWORD,
  },
});

// Middleware
const isAuth = require('../middleware/is-auth')

/* GET home page. */
router.get('/', isAuth, function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// 註冊頁面
router.get('/sign-up', function (req, res, next) {
  res.render('sign-up');
});

router.post('/sign-up', async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const hashPassword = await bcrypt.hash(password, 12)

    await User.create({ name, email, password: hashPassword })

    // 發信通知
    transporter.sendMail({
      from: process.env.MAILER_ACCOUNT,
      to: email,
      subject: 'Kanboo website register success',
      html: 'Congratulations on your successful registration.',
    })
      .then(info => {
        console.log({ info });
      })
      .catch(console.error);

    res.redirect('/login')
  } catch (e) {
    console.error(e)
    res.redirect('/sign-up')
  }
});

// 登入頁面
router.get('/login', function (req, res, next) {
  res.render('auth');
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password: inputPassword } = req.body

    const user = await User.findOne({ email }, { "name": 1, "password": 1 })
    const userPassword = user?.password ?? null

    if (!email || !inputPassword || !userPassword) {
      console.error('Email、密碼有空值，危險！！', { email, inputPassword, userPassword })
      return res.redirect('/login')
    }

    // console.log('compare', inputPassword, userPassword)
    const isMatch = await bcrypt.compare(inputPassword, userPassword);

    if (!isMatch) {
      console.error(e)
      return res.redirect('/login')
    }

    req.session.isLoggedIn = true
    req.session.save(e => {
      if (e) { console.error(e) }

      res.render('login-success', {
        type: 'Account',
        userName: user.name
      });
    })
  } catch (e) {
    console.error(e)
    res.redirect('/login')
  }
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
  if (!req.user) {
    return res.redirect('/login')
  }
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
  if (!req.user) {
    return res.redirect('/login')
  }
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
