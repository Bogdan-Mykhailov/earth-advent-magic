'use strict';
import { filterObj, STATUSES } from '../utils/constants.js';
import { User } from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/error.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: STATUSES.SUCCESS,
    results: users.length,
    data: { users }
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  // create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    const message = 'This route is not for password updates. Please use /updateMyPassword';
    return next(new AppError(message, 400));
  }
  // filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    });

  res.status(200).json({
    status: STATUSES.SUCCESS,
    data: {
      user: updatedUser
    }
  });
});

export const createUser = (req, res) => {
  res.status(500).json({
    status: STATUSES.ERROR,
    message: 'This route is not yet defined!'
  });
};
export const updateUser = (req, res) => {
  res.status(500).json({
    status: STATUSES.ERROR,
    message: 'This route is not yet defined!'
  });
};
export const getOneUser = (req, res) => {
  res.status(500).json({
    status: STATUSES.ERROR,
    message: 'This route is not yet defined!'
  });
};
export const deleteUser = (req, res) => {
  res.status(500).json({
    status: STATUSES.ERROR,
    message: 'This route is not yet defined!'
  });
};
