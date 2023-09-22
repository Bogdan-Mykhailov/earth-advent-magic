'use strict';

import Router from 'express';
import { APP_PATH } from '../utils/constants.js';
import { getAccount, getLoginForm, getOverview, getTour } from '../controllers/Views.js';
import { isLoggedIn, protect } from '../controllers/Auth.js';

export const viewRouter = Router();

viewRouter.get('/', isLoggedIn, getOverview);
viewRouter.get(`${APP_PATH.tour}${APP_PATH.slug}`, isLoggedIn, getTour);
viewRouter.get(`${APP_PATH.login}`, isLoggedIn, getLoginForm);
viewRouter.get(`${APP_PATH.me}`, protect,  getAccount);
