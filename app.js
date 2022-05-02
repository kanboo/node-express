var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo');
const fileupload = require("express-fileupload");
const passport = require('passport')

require('dotenv').config()

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var postRouter = require('./routes/post');
var imageRouter = require('./routes/image');

mongoose.connect(process.env.MONGODB_CONNECT)
  .then(() => console.log('Mongodb connect success'))
  .catch(e => console.error(e))

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(fileupload());

app.use(session({
  secret: 'verySecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30,
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_CONNECT })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/images', imageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
