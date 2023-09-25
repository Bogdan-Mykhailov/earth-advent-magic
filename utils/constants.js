'use strict';
import jwt from 'jsonwebtoken';

export const ENV_MODE = {
  DEV: 'development',
  PROD: 'production'
};

export const APP_PATH = {
  mainEndpoint: '/api/v1',
  api: '/api',
  tours: '/tours',
  tour: '/tour',
  users: '/users',
  reviews: '/reviews',
  topFiveCheap: '/top-5-cheap',
  tourStats: '/tour-stats',
  signup: '/signup',
  login: '/login',
  logout: '/logout',
  forgotPassword: '/forgotPassword',
  resetPassword: '/resetPassword',
  updateMyPassword: '/updateMyPassword',
  submitUserData: '/submit-user-data',
  updateMe: '/updateMe',
  deleteMe: '/deleteMe',
  monthlyPlan: '/monthly-plan',
  id: '/:id',
  tourId: '/:tourId',
  year: '/:year',
  token: '/:token',
  slug: '/:slug',
  me: '/me',
  toursWithin: '/tours-within',
  center: '/center',
  unit: '/unit',
  distance: '/:distance',
  distances: '/:distances',
  latLng: '/:latlng',
  unitType: '/:unit',
};

export const ROLES = {
  user: 'user',
  guide: 'guide',
  leadGuide: 'lead-guide',
  admin: 'admin'
};

export const FIELDS = {
  user: 'user',
  review: 'review',
  rating: 'rating'
};

export const PUBLIC_PATH = 'public';
export const VIEWS_PATH = 'views';
export const REVIEWS = 'reviews';
export const BASE = 'base';
export const PHOTO = 'photo';

export const USERS_IMG_DIRECTORY = 'public/img/users';
export const TOURS_IMG_DIRECTORY = 'public/img/tours';

export const STATUSES = {
  FAILED: 'failed',
  SUCCESS: 'success',
  ERROR: 'error'
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
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === ENV_MODE.PROD) {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  // remove password from output
  user.password = undefined;

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
  });

  return newObj;
};
