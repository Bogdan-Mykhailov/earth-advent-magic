'use strict';
import { TOURS_URL } from '../utils/constants.js';
import Router from 'express';
import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getMonthlyPlan,
  getOneTour,
  getTourStats,
  updateTour
} from '../controllers/Tour.js';
import { protect } from '../controllers/Auth.js';

export const tourRouter = Router();

tourRouter
  .route(TOURS_URL.topFiveCheap)
  .get(aliasTopTours, getAllTours)

tourRouter
  .route(TOURS_URL.tourStats)
  .get(getTourStats)

tourRouter
  .route(`${TOURS_URL.monthlyPlan}${TOURS_URL.year}`)
  .get(getMonthlyPlan)

tourRouter
  .route(`/`)
  .get(protect, getAllTours)
  .post(createTour);

tourRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);
