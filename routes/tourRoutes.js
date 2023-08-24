import { TOURS_URL } from '../helpers.js';
import express from 'express';
import {
  addTour,
  checkBody,
  checkId,
  deleteTour,
  getAllTours,
  getOneTour,
  updateTour
} from '../controllers/tourController.js';

export const tourRouter = express.Router();

tourRouter.param('id', checkId)

tourRouter
  .route(`/`)
  .get(getAllTours)
  .post(checkBody, addTour);

tourRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);
