'use strict';
import express from 'express';
import { TOURS_URL } from '../utils/constants.js';
import { createReview, getAllReviews, getOneReview } from '../controllers/Review.js';
import { protect, restrictTo } from '../controllers/Auth.js';

export const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(
    protect,
    restrictTo('user'),
    createReview);

reviewRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneReview)
  // .patch(updateReview)
  // .delete(deleteReview);
