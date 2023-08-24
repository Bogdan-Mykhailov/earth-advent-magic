import express from 'express';
import { TOURS_URL } from '../helpers.js';
import {
  addUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser
} from '../controllers/userController.js';

export const userRouter = express.Router();

userRouter
  .route('/')
  .get(getAllUsers)
  .post(addUser);

userRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneUser)
  .patch(updateUser)
  .delete(deleteUser);
