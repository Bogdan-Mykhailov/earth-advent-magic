'use strict';

import { Tour } from '../models/Tour.js';

export const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime
    // results: tours.length,
    // data: {
    //   tours: tours
    // }
  });
};
export const getOneTour = (req, res) => {
  const tourId = req.params.id * 1;
  // const tour = tours.find(({ id }) => id === tourId);
  //
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tours: tour
  //   }
  // });
};
export const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent!'
    });
  }
};
export const updateTour = (req, res) => {

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};
export const deleteTour = (req, res) => {

  res.status(204).json({
    status: 'success',
    data: null
  });
};
