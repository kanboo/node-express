const express = require('express')
const session = require('express-session')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const { catchErrorDev, catchErrorProd } = require('./utils/responseHandle')

require('dotenv').config()

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const imageRouter = require('./routes/image')

mongoose.connect(process.env.MONGODB_CONNECT)
  .then(() => console.log('Mongodb connect success'))
  .catch((e) => console.error(e))

const app = express()

// 程式出現重大錯誤時
process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('漏洞：Uncaughted Exception(出事拉，阿北！)')
  console.error(err)
  process.exit(1)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.use(session({
  secret: 'verySecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30,
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_CONNECT }),
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/api/posts', postRouter)
app.use('/api/images', imageRouter)

// 404 錯誤
app.use(function (req, res, next) {
  res.status(404).json({
    message: '無此路由資訊',
  })
})

/**
 * 錯誤處理
 */
app.use(function (err, req, res, next) {
  // For Dev
  if (process.env.NODE_ENV === 'dev') {
    return catchErrorDev(err, res)
  }

  // For Production
  if (err.name === 'ValidationError') {
    err.status = 400
    err.message = '資料欄位未填寫正確，請重新輸入！'
    return catchErrorProd(err, res)
  }

  catchErrorProd(err, res)
})

// 未捕捉到的 catch
process.on('unhandledRejection', (err, promise) => {
  console.error('漏洞：未捕捉到的 rejection：', promise, '原因：', err)
})

module.exports = app
