'use strict';
import { APP_PATH, ENV_MODE, STATUSES } from '../utils/constants.js';
import { AppError } from '../utils/error.js';

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name || err.keyValue.email;
  const message = `Duplicate field value: "${value}". Please use another value`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(({ message }) => message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = () => {
  const message = 'Invalid token. Please log in again!';
  return new AppError(message, 401);
};

const handleJWTExpiredError = () => {
  const message = 'Your token has expired! Please log in again.';

  return new AppError(message, 401);
};


const sendErrorDev = (err, req, res) => {
  // api
  if (req.originalUrl.startsWith(`${APP_PATH.api}`)) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // rendered website
  console.log(`${STATUSES.ERROR}`, err);

  return res.status(err.statusCode).render(STATUSES.ERROR, {
    title: 'Something went wrong!',
    message: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // api
  if (req.originalUrl.startsWith(`${APP_PATH.api}`)) {
    // operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // programing or other unknown error: don't leak error details
    // 1. log error
    console.log(`${STATUSES.ERROR}`, err);

    // 2. send generic message
    return res.status(500).json({
      status: STATUSES.ERROR,
      message: 'Something went wrong!'
    });
  }
  // rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render(STATUSES.ERROR, {
      title: 'Something went wrong!',
      message: err.message
    });
  }
  // programing or other unknown error: don't leak error details
  // 1. log error
  console.log(`${STATUSES.ERROR}`, err);

  // 2. send generic message
  return res.status(err.statusCode).render(STATUSES.ERROR, {
    title: 'Something went wrong!',
    message: 'Please try again later.'
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || STATUSES.ERROR;

  if (process.env.NODE_ENV === `${ENV_MODE.DEV}`) {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === `${ENV_MODE.PROD}`) {
    let error = Object.assign(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
