const successResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: 'success',
    data,
  })
}

const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    status: 'false',
    message,
  })
}

const catchResponse = (e, statusCode = 404, message = '') => {
  const error = new Error(e)
  error.status = statusCode
  error.message = message

  return error
}

module.exports = {
  successResponse,
  errorResponse,
  catchResponse,
}
