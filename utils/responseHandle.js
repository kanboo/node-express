const successResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: 'success',
    data
  })
}

const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    status: 'false',
    message
  })
}

module.exports = {
  successResponse,
  errorResponse
}