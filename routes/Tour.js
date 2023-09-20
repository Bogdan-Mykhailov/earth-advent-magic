'use strict';
import { ROLES, APP_PATH } from '../utils/constants.js';
import Router from 'express';
import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours, getDistances,
  getMonthlyPlan,
  getOneTour,
  getTourStats,
  getToursWithin,
  updateTour
} from '../controllers/Tour.js';
import { protect, restrictTo } from '../controllers/Auth.js';
import { reviewRouter } from './Review.js';

export const tourRouter = Router();

tourRouter
  .route(APP_PATH.topFiveCheap)
  .get(aliasTopTours, getAllTours);

tourRouter
  .route(APP_PATH.tourStats)
  .get(getTourStats);

tourRouter
  .route(`${APP_PATH.monthlyPlan}${APP_PATH.year}`)
  .get(
    protect,
    restrictTo(`${ROLES.admin}`, `${ROLES.leadGuide}`, `${ROLES.guide}`),
    getMonthlyPlan
  );

tourRouter
  .route(
    `${APP_PATH.toursWithin}${APP_PATH.distance}${APP_PATH.center}${APP_PATH.latLng}${APP_PATH.unit}${APP_PATH.unitType}`)
  .get(getToursWithin);

tourRouter
  .route(`${APP_PATH.distances}${APP_PATH.latLng}${APP_PATH.unit}${APP_PATH.unitType}`)
  .get(getDistances)

tourRouter
  .route('/')
  .get(getAllTours)
  .post(
    protect,
    restrictTo(`${ROLES.admin}`, `${ROLES.leadGuide}`),
    createTour
  );

tourRouter
  .route(`${APP_PATH.id}`)
  .get(getOneTour)
  .patch(
    protect,
    restrictTo(`${ROLES.admin}`, `${ROLES.leadGuide}`),
    updateTour)
  .delete(protect, restrictTo(`${ROLES.admin}`, `${ROLES.leadGuide}`), deleteTour);

tourRouter
  .use(`${APP_PATH.tourId}${APP_PATH.reviews}`, reviewRouter);
