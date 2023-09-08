'use strict';
import { User } from '../models/User.js';
import { signToken, STATUSES } from '../utils/constants.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/error.js';

export const signup = catchAsync(async (req, res, next) => {
  // for secure reason I need only that fields, so now nobody can't change role to admin for user
  // it possible only in mongo compass
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: STATUSES.SUCCESS,
    token,
    data: {
      user: newUser
    }
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email & pass is exist
  if (!email || !password) {
    const message = 'Please provide your email and password.';
    return next(new AppError(message, 400));
  }
  // check if user exists & pass is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    const message = 'Please provide correct email or password';
    return next(new AppError(message, 401));
  }
  // if everything is ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: STATUSES.SUCCESS,
    token
  });
});
