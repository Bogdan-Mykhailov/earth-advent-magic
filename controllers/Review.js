'use strict';
import { Review } from '../models/Review.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';

export const setTourUserIds = (req, res, next) => {
  // allow nested routes
  if(!req.body.tour) {
    req.body.tour = req.params.tourId;
    req.body.user = req.user.id;
  }
  next();
}

export const getAllReviews = getAll(Review);
export const getOneReview = getOne(Review);
export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
