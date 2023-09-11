'use strict';
import { User } from '../models/User.js';
import { signToken, STATUSES } from '../utils/constants.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/error.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/email.js';

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

export const protect = catchAsync(async (req, res, next) => {
  // getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    const message = 'You are not logged in! Please log in to get access';

    return next(new AppError(message, 401));
  }
  // verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user still exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    const message = 'The user belonging to this token does no longer exist.';

    return next(new AppError(message, 401));
  }
  // check if user change pass after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    const message = 'User recently change password! Please log in again.';
    return next(new AppError(message, 401));
  }
  //grand access to protected route
  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const message = 'You do not have permission to perform this action.';
      return next(new AppError(message, 403));
    }

    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    const message = 'There is no user with email address';
    return next(new AppError(message, 404));
  }
  // generate the random reset token
  const resetToken = user.createPassResetToken();
  await user.save({ validateBeforeSave: false });
  // send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: STATUSES.SUCCESS,
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const message = 'There was an error sending the email. Try again later!'
    return next(new AppError(message, 500))
  }
});

export const resetPassword = (req, res, next) => {

};
