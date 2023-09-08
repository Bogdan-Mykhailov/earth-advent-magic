'use strict';
import { User } from '../models/User.js';
import { STATUSES } from '../utils/constants.js';
import { catchAsync } from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';

export const signup = catchAsync(async (req, res, next) => {
  // for secure reason I need only that fields, so now nobody can't change role to admin for user
  // it possible only in mongo compass
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(201).json({
    status: STATUSES.SUCCESS,
    token,
    data: {
      user: newUser
    }
  });
});


