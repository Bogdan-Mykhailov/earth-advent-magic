'use strict';
import express from 'express';
import { protect } from '../controllers/Auth.js';
import { APP_PATH } from '../utils/constants.js';
import { getCheckoutSession } from '../controllers/Booking.js';

export const bookingRouter = express.Router();

bookingRouter.get(
  `${APP_PATH.checkoutSession}${APP_PATH.tourId}`,
  protect,
  getCheckoutSession)
