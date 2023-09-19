'use strict';
import express from 'express';
import morgan from 'morgan';
import { BASE, PUBLIC_PATH, TOURS_URL, VIEWS_PATH } from './utils/constants.js';
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

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3 routes
app.get('/', (req, res) => {
  res.status(200).render(BASE, {
    tour: 'The Forest Hiker',
    user: 'Bogdan'
  });
})

app.use(`${TOURS_URL.baseUrl}${TOURS_URL.tours}`, tourRouter);
app.use(`${TOURS_URL.baseUrl}${TOURS_URL.users}`, userRouter);
app.use(`${TOURS_URL.baseUrl}${TOURS_URL.reviews}`, reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(
    `Cant find ${req.originalUrl} on this server!`,
    404
  ));
});

app.use(globalErrorHandler);
