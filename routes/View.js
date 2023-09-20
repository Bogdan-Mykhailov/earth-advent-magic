'use strict';

import Router from 'express';
import { APP_PATH } from '../utils/constants.js';
import { getLoginForm, getOverview, getTour } from '../controllers/Views.js';
import { protect } from '../controllers/Auth.js';

export const viewRouter = Router();

viewRouter.get('/', getOverview);

viewRouter.get(`${APP_PATH.tour}${APP_PATH.slug}`, protect, getTour);

viewRouter.get(`${APP_PATH.login}`, getLoginForm)
