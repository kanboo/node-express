/**
 * Ref：
 * https://fufong79570.medium.com/%E4%B8%B2%E6%8E%A5google-%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%85%A5-%E5%AF%A6%E4%BD%9C-node-js-b750821cde90
 * https://github.com/passport/todos-express-google-oauth2
 */
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log('profile', profile)
      return cb(null, profile);
    }
  )
)

// 可設定要將哪些 user 資訊，儲存在 Session 中的 passport.user
passport.serializeUser(function (user, cb) {
  // console.log('serializeUser', user)
  cb(null, user);
});

// 可藉由從 Session 中獲得的資訊去撈該 user 的資料
passport.deserializeUser(function (obj, cb) {
  // console.log('deserializeUser', obj)
  cb(null, obj);
});

module.exports = passport