'use strict';
import { User } from '../models/User.js';
import { STATUSES } from '../utils/constants.js';
import { catchAsync } from '../utils/catchAsync.js';

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: STATUSES.SUCCESS,
    data: {
      user: newUser
    }
  });
});


