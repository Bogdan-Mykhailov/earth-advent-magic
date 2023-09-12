'use strict';
import express from 'express';
import morgan from 'morgan';
import { PUBLIC_PATH, TOURS_URL } from './utils/constants.js';
import { tourRouter } from './routes/Tour.js';
import { userRouter } from './routes/User.js';
import { AppError } from './utils/error.js';
import { globalErrorHandler } from './controllers/Error.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

export const app = express();

// 1 global middlewares
// set security http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests from this IP, please try again in an hour!'
});
app.use(`${TOURS_URL.api}`, limiter);

// body parser, reading data from the body into req.body
app.use(express.json({
  limit: '10kb'
}));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));

// serving static files
app.use(express.static(PUBLIC_PATH));

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3 routes
app.use(`${TOURS_URL.tours}`, tourRouter);
app.use(`${TOURS_URL.users}`, userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(
    `Cant find ${req.originalUrl} on this server!`,
    404
  ));
});

app.use(globalErrorHandler);
