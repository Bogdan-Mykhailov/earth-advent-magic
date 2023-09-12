'use strict';
import { Review } from '../models/Review.js'
import { catchAsync } from '../utils/catchAsync.js';
import { STATUSES } from '../utils/constants.js';
import { AppError } from '../utils/error.js';

export const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: STATUSES.SUCCESS,
    results: reviews.length,
    data: { reviews }
  });
});

export const getOneReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    const message = `No review found with that ID!`;
    return next(new AppError(
      message,
      404
    ));
  }

  res.status(200).json({
    status: STATUSES.SUCCESS,
    data: { review }
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    status: STATUSES.SUCCESS,
    data: { review }
  });
});
