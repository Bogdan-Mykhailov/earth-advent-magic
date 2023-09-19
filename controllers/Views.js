'use strict';

import { catchAsync } from '../utils/catchAsync.js';
import { Tour } from '../models/Tour.js';

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

export const getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
}
