'use strict';
import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { TOURS_URL } from './helpers.js';

dotenv.config();
const PORT = process.env.PORT;

const app = express();

// 1 middlewares
app.use(morgan('dev'))
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);

// 2 route handlers
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};
const getOneTour = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find(({ id }) => id === tourId);

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour
    }
  });
}
const addTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
}
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
}
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
};

const addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
};


const getOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
};

// 3 routes
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter
  .route(`/`)
  .get(getAllTours)
  .post(addTour);

tourRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);

userRouter
  .route('/')
  .get(getAllUsers)
  .post(addUser);

userRouter
  .route(`${TOURS_URL.id}`)
  .get(getOneUser)
  .patch(updateUser)
  .delete(deleteUser);

app.use(`${TOURS_URL.tours}`, tourRouter);
app.use(`${TOURS_URL.users}`, userRouter);

// 4 starting server
app.listen(PORT, () => {
  console.log(`Server use port ${PORT}`);
});
