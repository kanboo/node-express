/**
 * Ref：
 * https://israynotarray.com/nodejs/20220525/790433249/
 * https://fufong79570.medium.com/%E4%B8%B2%E6%8E%A5google-%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%85%A5-%E5%AF%A6%E4%BD%9C-node-js-b750821cde90
 * https://github.com/passport/todos-express-google-oauth2
 */

const bcrypt = require('bcrypt')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const { registerSuccessMail } = require('./mailTransporter')

// Models
const User = require('../models/user')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_LOGIN_CALL_BACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const userEmail = profile.emails?.[0]?.value ?? null

        const user = await User.findOne({ email: userEmail })
        if (user) { return cb(null, user) }

        // 新增使用者
        const password = await bcrypt.hash(process.env.BCRYPT_RANDOM_PASSWORD, 12)
        const newUser = await User.create({
          name: profile.displayName,
          email: userEmail,
          password,
          photo: profile.photos?.[0]?.value ?? '',
          googleId: profile.id,
        })

        // 註冊成功通知信
        registerSuccessMail(userEmail)

        return cb(null, newUser)
      } catch (error) {
        console.log(error)
        return cb(error, null)
      }
    },
  ),
)

module.exports = passport
