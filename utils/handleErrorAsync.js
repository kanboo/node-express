/**
 * Node.js (Express) error handling middleware with router
 *
 * @link https://stackoverflow.com/questions/43356705/node-js-express-error-handling-middleware-with-router
 */

const handleErrorAsync = function handleErrorAsync (func) {
  // func 先將 async fun 帶入參數儲存
  // middleware 先接住 router 資料
  return function (req, res, next) {
      // 再執行函式，並增加 catch 條件去捕捉
      // async 本身就是 promise，所以可用 catch 去捕捉
    func(req, res, next).catch(
      function (error) {
        return next(error)
      },
    )
  }
}

module.exports = handleErrorAsync
