const successResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    data,
  })
}

module.exports = {
  successResponse,
}
