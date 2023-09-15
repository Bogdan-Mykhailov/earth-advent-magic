'use strict';
import { ROLES, TOURS_URL } from '../utils/constants.js';
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
  .route(TOURS_URL.topFiveCheap)
  .get(aliasTopTours, getAllTours);

tourRouter
  .route(TOURS_URL.tourStats)
  .get(getTourStats);

tourRouter
  .route(`${TOURS_URL.monthlyPlan}${TOURS_URL.year}`)
  .get(
    protect,
    restrictTo(`${ROLES.admin}`, `${ROLES.leadGuide}`, `${ROLES.guide}`),
    getMonthlyPlan
  );

tourRouter
  .route(
    `${TOURS_URL.toursWithin}${TOURS_URL.distance}${TOURS_URL.center}${TOURS_URL.latLng}${TOURS_URL.unit}${TOURS_URL.unitType}`)
  .get(getToursWithin);

tourRouter
  .route(`${TOURS_URL.distances}${TOURS_URL.latLng}${TOURS_URL.unit}${TOURS_URL.unitType}`)
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
  .route(`${TOURS_URL.id}`)
  .get(getOneTour)
  .patch(
    protect,
    restrictTo(`${ROLES.admin}`, `${ROLES.leadGuide}`),
    updateTour)
  .delete(protect, restrictTo(`${ROLES.admin}`, `${ROLES.leadGuide}`), deleteTour);

tourRouter
  .use(`${TOURS_URL.tourId}${TOURS_URL.reviews}`, reviewRouter);
