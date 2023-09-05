'use strict';
import { STATUSES } from './constants.js';

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4')
      ? STATUSES.FAILED
      : STATUSES.ERROR;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
