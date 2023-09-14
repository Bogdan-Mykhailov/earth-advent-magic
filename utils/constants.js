'use strict';
import jwt from 'jsonwebtoken';

export const TOURS_URL = {
  baseUrl: '/api/v1',
  api: '/api',
  tours: '/tours',
  users: '/users',
  reviews: '/reviews',
  topFiveCheap: '/top-5-cheap',
  tourStats: '/tour-stats',
  signup: '/signup',
  login: '/login',
  forgotPassword: '/forgotPassword',
  resetPassword: '/resetPassword',
  updateMyPassword: '/updateMyPassword',
  updateMe: '/updateMe',
  deleteMe: '/deleteMe',
  monthlyPlan: '/monthly-plan',
  id: '/:id',
  tourId: '/:tourId',
  year: '/:year',
  token: '/:token',
  me: '/me'
};

export const ROLES = {
  user: 'user',
  guide: 'guide',
  leadGuide: 'lead-guide',
  admin: 'admin'
}

export const PUBLIC_PATH = './public';
export const REVIEWS = 'reviews';

export const STATUSES = {
  FAILED: 'failed',
  SUCCESS: 'success',
  ERROR: 'error',
};

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

export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 *1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions)

  // remove password from output
  user.password = undefined

  res.status(statusCode).json({
    status: STATUSES.SUCCESS,
    token,
    data: {
      user
    }
  });
};

export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  })

  return newObj;
};
