'use strict';
import Router from 'express';
import { ROLES, TOURS_URL } from '../utils/constants.js';
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
  login, protect,
  resetPassword, restrictTo,
  signup,
  updatePassword
} from '../controllers/Auth.js';

export const userRouter = Router();
userRouter.post(`${TOURS_URL.signup}`, signup);
userRouter.post(`${TOURS_URL.login}`, login);

userRouter.post(`${TOURS_URL.forgotPassword}`, forgotPassword);
userRouter.patch(`${TOURS_URL.resetPassword}${TOURS_URL.token}`, resetPassword);

// protect all rotes after this middleware
userRouter.use(protect);

userRouter.patch(`${TOURS_URL.updateMyPassword}`, updatePassword);
userRouter.patch(`${TOURS_URL.updateMe}`, updateMe);
userRouter.delete(`${TOURS_URL.deleteMe}`, deleteMe);

userRouter.get(`${TOURS_URL.me}`, getMe, getOneUser);

userRouter.use(restrictTo(`${ROLES.admin}`));

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneUser)
  .patch(updateUser)
  .delete(deleteUser);
