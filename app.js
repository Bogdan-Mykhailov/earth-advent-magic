'use strict';
import express from 'express';
import morgan from 'morgan';
import { BASE, PUBLIC_PATH, APP_PATH, VIEWS_PATH, ENV_MODE } from './utils/constants.js';
import { tourRouter } from './routes/Tour.js';
import { userRouter } from './routes/User.js';
import { AppError } from './utils/error.js';
import { globalErrorHandler } from './controllers/Error.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import { reviewRouter } from './routes/Review.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { viewRouter } from './routes/View.js';
import cookieParser from 'cookie-parser';

export const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, VIEWS_PATH));

// 1 global middlewares
// serving static files
app.use(express.static(path.join(__dirname, PUBLIC_PATH)));
// app.use(express.static(PUBLIC_PATH));

// set security http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === `${ENV_MODE.DEV}`) {
  app.use(morgan('dev'));
}

// limit requests from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests from this IP, please try again in an hour!'
});
app.use(`${APP_PATH.api}`, limiter);

// body parser, reading data from the body into req.body
app.use(express.json({
  limit: '10kb'
}));

app.use(cookieParser());

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

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// 3 routes
app.use('/', viewRouter);
app.use(`${APP_PATH.mainEndpoint}${APP_PATH.tours}`, tourRouter);
app.use(`${APP_PATH.mainEndpoint}${APP_PATH.users}`, userRouter);
app.use(`${APP_PATH.mainEndpoint}${APP_PATH.reviews}`, reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(
    `Cant find ${req.originalUrl} on this server!`,
    404
  ));
});

app.use(globalErrorHandler);
