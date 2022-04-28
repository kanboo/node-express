const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const users = {}

// 新增google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // profile._json內存放妳向google要的使用者資料
      if (profile._json) {
        const id = profile._json.sub
        users[id] = profile._json

        //使用者資料存在req內，回傳到後面
        return done(null, users[id])
      }
      //失敗回傳false
      return done(null, false)
    }
  )
)

// 這邊簡單來說就是簡化存在session內的資料，session存放使用者id
// 再用使用者id找出詳細資料
passport.serializeUser((user, done) => {
  return done(null, user.sub)
})
passport.deserializeUser((userId, done) => {
  const user = users[userId]
  return done(null, user)
})

module.exports = passport