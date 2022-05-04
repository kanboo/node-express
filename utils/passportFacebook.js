/**
 * Ref：
 * https://ithelp.ithome.com.tw/articles/10197391
 * https://github.com/jaredhanson/passport-facebook
 */

var passport = require('passport');
var Strategy = require('passport-facebook');

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new Strategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_LOGIN_CALL_BACK_URL,
    },
    function (accessToken, refreshToken, profile, cb) {
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      console.log('FB Profile', profile)
      return cb(null, profile);
    }
  )
);

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
