'use strict';
import express from 'express';
import morgan from 'morgan';
import { TOURS_URL } from './helpers.js';
import { tourRouter } from './routes/Tour.js';
import { userRouter } from './routes/User.js';

export const app = express();

// 1 middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static('./public'));

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3 routes
app.use(`${TOURS_URL.tours}`, tourRouter);
app.use(`${TOURS_URL.users}`, userRouter);

