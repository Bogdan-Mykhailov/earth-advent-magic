'use strict';
import express from 'express';
import dotenv from 'dotenv';
import {
  TOURS_URL,
  addTour,
  deleteTour,
  getAllTours,
  getOneTour,
  updateTour
} from './helpers.js';

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app
  .route(`${TOURS_URL.baseUrl}`)
  .get(getAllTours)
  .post(addTour);

app
  .route(`${TOURS_URL.baseUrl}/:id`)
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(PORT, () => {
  console.log(`Server use port ${PORT}`);
});
