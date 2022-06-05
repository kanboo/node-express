const mongoose = require('mongoose')
const httpStatus = require('http-status')

const ApiError = require('../utils/ApiError')

const errorConverter = (err, req, res, next) => {
  let error = err

  if (!(error instanceof ApiError)) {
    const statusCode =
      (error.statusCode || error instanceof mongoose.Error)
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR

    const message = error.message || httpStatus[statusCode]
    error = new ApiError(statusCode, message, false, err.stack)
  }

  next(error)
}

const errorHandler = (err, req, res, next) => {
  let { statusCode, message, errorType } = err

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }

  const response = {
    code: statusCode,
    message,
    errorType,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  }

  res.status(statusCode).send(response)
}

module.exports = {
  errorConverter,
  errorHandler,
}
