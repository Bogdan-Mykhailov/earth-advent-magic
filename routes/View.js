'use strict';

import Router from 'express';
import { TOURS_URL } from '../utils/constants.js';
import { getOverview, getTour } from '../controllers/Views.js';

export const viewRouter = Router();

viewRouter.get('/', getOverview);

viewRouter.get(`${TOURS_URL.tour}${TOURS_URL.slug}`, getTour);
