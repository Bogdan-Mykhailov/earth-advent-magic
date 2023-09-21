'use strict';
import Router from 'express';
import { ROLES, APP_PATH } from '../utils/constants.js';
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers, getMe,
  getOneUser,
  updateMe,
  updateUser
} from '../controllers/User.js';
import {
  forgotPassword,
  login, logout, protect,
  resetPassword, restrictTo,
  signup,
  updatePassword
} from '../controllers/Auth.js';

export const userRouter = Router();
userRouter.post(`${APP_PATH.signup}`, signup);
userRouter.post(`${APP_PATH.login}`, login);
userRouter.get(`${APP_PATH.logout}`, logout);

userRouter.post(`${APP_PATH.forgotPassword}`, forgotPassword);
userRouter.patch(`${APP_PATH.resetPassword}${APP_PATH.token}`, resetPassword);

// protect all rotes after this middleware
userRouter.use(protect);

userRouter.patch(`${APP_PATH.updateMyPassword}`, updatePassword);
userRouter.patch(`${APP_PATH.updateMe}`, updateMe);
userRouter.delete(`${APP_PATH.deleteMe}`, deleteMe);

userRouter.get(`${APP_PATH.me}`, getMe, getOneUser);

userRouter.use(restrictTo(`${ROLES.admin}`));

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route(`${APP_PATH.id}`)
  .get(getOneUser)
  .patch(updateUser)
  .delete(deleteUser);
