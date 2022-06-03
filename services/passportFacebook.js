/**
 * Ref：
 * https://ithelp.ithome.com.tw/articles/10197391
 * https://github.com/jaredhanson/passport-facebook
 */
const bcrypt = require('bcrypt')
const passport = require('passport')
const Strategy = require('passport-facebook').Strategy

const { registerSuccessMail } = require('./mailTransporter')

// Models
const User = require('../models/user')

passport.use(
  new Strategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_LOGIN_CALL_BACK_URL,
      profileFields: ['id', 'displayName', 'photos', 'email', 'gender'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const userEmail = profile.emails?.[0]?.value ?? null
        const facebookId = profile.id ?? null

        let user = await User.findOne({ email: userEmail })

        if (user) {
          if (!user.facebookId) {
            user = await User.findByIdAndUpdate(user.id, { facebookId })
          }

          return cb(null, user)
        }

        // 新增使用者
        const password = await bcrypt.hash(process.env.BCRYPT_RANDOM_PASSWORD, 12)
        const newUser = await User.create({
          name: profile.displayName,
          email: userEmail,
          password,
          photo: profile.photos?.[0]?.value ?? '',
          facebookId,
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
