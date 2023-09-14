'use strict';
import { Review } from '../models/Review.js'
import { catchAsync } from '../utils/catchAsync.js';
import { STATUSES } from '../utils/constants.js';
import { AppError } from '../utils/error.js';
import { createOne, deleteOne, updateOne } from './handlerFactory.js';
import { Tour } from '../models/Tour.js';

export const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

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

export const setTourUserIds = (req, res, next) => {
  // allow nested routes
  if(!req.body.tour) {
    req.body.tour = req.params.tourId;
    req.body.user = req.user.id;
  }
  next();
}

export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
