'use strict';
import { STATUSES } from '../utils/constants.js';

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || STATUSES.ERROR;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
}
