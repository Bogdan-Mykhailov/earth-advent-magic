'use strict';

import Router from 'express';
import { APP_PATH } from '../utils/constants.js';
import { getAccount, getLoginForm, getOverview, getTour } from '../controllers/Views.js';
import { isLoggedIn, protect } from '../controllers/Auth.js';
import { updateSettings } from '../public/js/updateSettings.js';
import { createBookingCheckout } from '../controllers/Booking.js';

export const viewRouter = Router();

viewRouter.get('/',createBookingCheckout, isLoggedIn, getOverview);
viewRouter.get(`${APP_PATH.tour}${APP_PATH.slug}`, isLoggedIn, getTour);
viewRouter.get(`${APP_PATH.login}`, isLoggedIn, getLoginForm);
viewRouter.get(`${APP_PATH.me}`, protect,  getAccount);

viewRouter.post(`${APP_PATH.submitUserData}`, protect, updateSettings);
