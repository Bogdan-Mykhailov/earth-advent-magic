'use strict';
import express from 'express';
import { ROLES, TOURS_URL } from '../utils/constants.js';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getOneReview,
  setTourUserIds,
  updateReview
} from '../controllers/Review.js';
import { protect, restrictTo } from '../controllers/Auth.js';

export const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(protect);

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(
    restrictTo(`${ROLES.user}`),
    setTourUserIds,
    createReview);

reviewRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneReview)
  .patch(restrictTo(`${ROLES.user}`, `${ROLES.admin}`), updateReview)
  .delete(restrictTo(`${ROLES.user}`, `${ROLES.admin}`), deleteReview);
