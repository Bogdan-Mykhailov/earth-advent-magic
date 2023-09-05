'use strict';
import express from 'express';
import morgan from 'morgan';
import { PUBLIC_PATH, STATUSES, TOURS_URL } from './utils/constants.js';
import { tourRouter } from './routes/Tour.js';
import { userRouter } from './routes/User.js';

export const app = express();

// 1 middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(PUBLIC_PATH));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3 routes
app.use(`${TOURS_URL.tours}`, tourRouter);
app.use(`${TOURS_URL.users}`, userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: STATUSES.FAILED,
    message: `Cant find ${req.originalUrl} on this server!`
  })
  next();
})
