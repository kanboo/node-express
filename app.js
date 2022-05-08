const express = require('express')
const path = require('path')

require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/**
 * Mongo 連線
 */
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNECT)
  .then(() => console.log('Mongodb connect success'))
  .catch((e) => console.error(e))

/**
 * Server session
 */
const session = require('express-session')
const MongoStore = require('connect-mongo')

app.use(session({
  secret: 'verySecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30,
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_CONNECT }),
}))

/**
 * 靜態資源路徑設定
 */
app.use(express.static(path.join(__dirname, 'public')))

/**
 * Pug 樣版
 */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

/**
 * Log 紀錄
 */
const logger = require('morgan')
app.use(logger('dev'))

/**
 * Cookie 解析
 */
const cookieParser = require('cookie-parser')
app.use(cookieParser())

/**
 * CORS
 */
const cors = require('cors')
app.use(cors())

/**
 * 第三方登入設定
 */
const passport = require('passport')
app.use(passport.initialize())
app.use(passport.session())

/**
 * 程式出現重大錯誤時，紀錄 Log
 */
process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('漏洞：Uncaughted Exception(出事拉，阿北！)')
  console.error(err)
  process.exit(1)
})

/**
 * Router
 */

// For Server
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')

app.use('/', indexRouter)
app.use('/auth', authRouter)

// For API
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const imageRouter = require('./routes/image')

const authenticationAndGetUser = require('./middleware/authenticationAndGetUser')

app.use('/api/users', userRouter)
app.use('/api/posts', authenticationAndGetUser, postRouter)
app.use('/api/images', authenticationAndGetUser, imageRouter)

/**
 * 404 錯誤
 */
app.use(function (req, res, next) {
  res.status(404).json({
    message: '無此路由資訊',
  })
})

/**
 * 錯誤處理
 */
const { catchErrorDev, catchErrorProd } = require('./utils/responseHandle')
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

/**
 * 未捕捉到的 catch
 */
process.on('unhandledRejection', (err, promise) => {
  console.error('漏洞：未捕捉到的 rejection：', promise, '原因：', err)
})

module.exports = app
