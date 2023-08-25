import { TOURS_URL } from '../helpers.js';
import Router from 'express';
import {
  createTour,
  deleteTour,
  getAllTours,
  getOneTour,
  updateTour
} from '../controllers/Tour.js';

export const tourRouter = Router();

tourRouter
  .route(`/`)
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);
