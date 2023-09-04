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

export const userRouter = Router();

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneUser)
  .patch(updateUser)
  .delete(deleteUser);
