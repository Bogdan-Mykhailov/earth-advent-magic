'use strict';
import { STATUSES } from '../utils/constants.js';
import { User } from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: STATUSES.SUCCESS,
    results: users.length,
    data: { users }
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
