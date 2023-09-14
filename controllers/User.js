'use strict';
import { filterObj, STATUSES } from '../utils/constants.js';
import { User } from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/error.js';
import { deleteOne, updateOne } from './handlerFactory.js';

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

export const deleteMe = catchAsync(async (req,res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: STATUSES.SUCCESS,
    data: null
  });
});

export const createUser = (req, res) => {
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

// do not update password with this
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
