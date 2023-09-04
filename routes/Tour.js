'use strict';
import { TOURS_URL } from '../utils/constants.js';
import Router from 'express';
import {
  aliasTopTours,
  createTour,
  deleteTour,
  getAllTours,
  getOneTour,
  updateTour
} from '../controllers/Tour.js';

export const tourRouter = Router();

tourRouter
  .route(TOURS_URL.topFiveCheap)
  .get(aliasTopTours, getAllTours)

tourRouter
  .route(`/`)
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);
