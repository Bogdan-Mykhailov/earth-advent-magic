'use strict';
import { login } from '../controllers/Auth.js';
import jwt from 'jsonwebtoken';

export const TOURS_URL = {
  tours: '/api/v1/tours',
  users: '/api/v1/users',
  topFiveCheap: '/top-5-cheap',
  tourStats: '/tour-stats',
  signup: '/signup',
  login: '/login',
  forgotPassword: '/forgotPassword',
  resetPassword: '/resetPassword',
  monthlyPlan: '/monthly-plan',
  id: '/:id',
  year: '/:year',
  token: '/:token'
};

export const PUBLIC_PATH = './public'

export const STATUSES = {
  FAILED: 'failed',
  SUCCESS: 'success',
  ERROR: 'error',
}

export const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

export const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to client

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // programing or other unknown error: don't leak error details
  } else {
    // 1. log error
    console.log('error', err);

    // 2. send generic message
    res.status(500).json({
      status: STATUSES.ERROR,
      message: 'Something went wrong!'
    });
  }
};

export const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

