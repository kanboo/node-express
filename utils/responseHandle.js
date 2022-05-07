const successResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    data,
  })
}

const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    message,
  })
}

const catchErrorDev = (err, res) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: err,
    stack: err.stack,
  })
}

const catchErrorProd = (err, res) => {
  // log 紀錄
  console.error('漏洞：出現重大錯誤', err)
  // 送出罐頭預設訊息
  res.status(err.status || 500).json({
    message: '系統錯誤，請洽系統管理員',
  })
}

module.exports = {
  successResponse,
  errorResponse,
  catchErrorDev,
  catchErrorProd,
}
