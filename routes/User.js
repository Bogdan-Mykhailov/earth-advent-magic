'use strict';
import Router from 'express';
import { TOURS_URL } from '../utils/constants.js';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateMe,
  updateUser
} from '../controllers/User.js';
import {
  forgotPassword,
  login, protect,
  resetPassword,
  signup, updatePassword
} from '../controllers/Auth.js';

export const userRouter = Router();

userRouter.post(`${TOURS_URL.signup}`, signup);
userRouter.post(`${TOURS_URL.login}`, login);

userRouter.post(`${TOURS_URL.forgotPassword}`, forgotPassword);
userRouter.patch(`${TOURS_URL.resetPassword}${TOURS_URL.token}`, resetPassword);

userRouter.patch(`${TOURS_URL.updateMyPassword}`, protect, updatePassword);
userRouter.patch(`${TOURS_URL.updateMe}`, protect, updateMe);

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneUser)
  .patch(updateUser)
  .delete(deleteUser);
