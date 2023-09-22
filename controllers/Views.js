'use strict';
import { catchAsync } from '../utils/catchAsync.js';
import { Tour } from '../models/Tour.js';
import { FIELDS, REVIEWS } from '../utils/constants.js';
import { AppError } from '../utils/error.js';

export const getOverview = catchAsync(async (req, res, next) => {
  // 1 get tour data from collection
  const tours = await Tour.find();
  // 2 build template
  // 3 render that template using tour data from 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  // 1 get the data, for the requested tour (including reviews and guides
  const tour = await Tour
    .findOne({ slug: req.params.slug })
    .populate({
      path: REVIEWS,
      fields: `${FIELDS.rating} ${FIELDS.review} ${FIELDS.user}`
    });

  if(!tour) {
    const message = 'There is no tour with that name.';
    return next(new AppError(message, 404))
  }

  // 2 build template
  // 3 render template using data from 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

export const getLoginForm = (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
};
