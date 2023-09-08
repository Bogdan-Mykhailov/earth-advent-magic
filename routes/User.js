'use strict';
import Router from 'express';
import { TOURS_URL } from '../utils/constants.js';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser
} from '../controllers/User.js';
import {
  signup
} from '../controllers/Auth.js';

export const userRouter = Router();

userRouter.post(`${TOURS_URL.signup}`, signup)

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneUser)
  .patch(updateUser)
  .delete(deleteUser);
