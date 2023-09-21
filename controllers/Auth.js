'use strict';
import { User } from '../models/User.js';
import { createSendToken, STATUSES } from '../utils/constants.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/error.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

export const signup = catchAsync(async (req, res, next) => {
  // for secure reason I need only that fields, so now nobody can't change role to admin for user
  // it possible only in mongo compass
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    active: req.body.active
  });

  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: STATUSES.SUCCESS
  });
};

export const protect = catchAsync(async (req, res, next) => {
  // getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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

// only for rendered pages, no error
export const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // verify token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      // check if user still exist
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next();
      }
      // check if user change pass after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      //there is a logged-in user
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next()
    }
  }
  next();
};

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

    const message = 'There was an error sending the email. Try again later!';
    return next(new AppError(message, 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  // if token has expired, and there is user, set the new password
  if (!user) {
    const message = 'Token is invalid or has expired';
    return next(new AppError(message, 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // update changedPasswordAt property for the user
  // log the user in, send JWT
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {

    const message = 'Your current password is wrong.';
    return next(new AppError(message, 401));
  }
  // if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // log user in, send JWT
  createSendToken(user, 200, res);
});
