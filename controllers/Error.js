'use strict';
import { sendErrorDev, sendErrorProd, STATUSES } from '../utils/constants.js';
import { AppError } from '../utils/error.js';

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || STATUSES.ERROR;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    sendErrorProd(error, res);
  }
};
