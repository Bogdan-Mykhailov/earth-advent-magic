'use strict';
import { Tour } from '../models/Tour.js';
import { APIFeatures } from '../utils/api-features.js';
import { STATUSES } from '../utils/constants.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/error.js';

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

export const getAllTours = catchAsync(async (req, res, next) => {
  // execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // send response
  res.status(200).json({
    status: STATUSES.SUCCESS,
    results: tours.length,
    data: { tours }
  });
});

export const getOneTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    const message = `No tour found with that ID!`;
    return next(new AppError(
      message,
      404
    ));
  }

  res.status(200).json({
    status: STATUSES.SUCCESS,
    data: {
      tours: tour
    }
  });
});

export const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: STATUSES.SUCCESS,
    data: {
      tour: newTour
    }
  });
});

export const updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedTour) {
    return next(new AppError(
      `No tour found with that ID!`,
      404
    ));
  }

  res.status(200).json({
    status: STATUSES.SUCCESS,
    data: {
      tour: updatedTour
    }
  });
});

export const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOneAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError(
      `No tour found with that ID!`,
      404
    ));
  }

  res.status(204).json({
    status: STATUSES.SUCCESS,
    data: null
  });
});

export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 }
      }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: {
        avgPrice: 1
      }
    }
    // return all tours not equal 'EASY'
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' }
    //   }
    // }
  ]);

  res.status(200).json({
    status: STATUSES.SUCCESS,
    data: {
      stats
    }
  });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numTourStarts: -1 } },
    { $limit: 12 }
  ]);

  res.status(200).json({
    status: STATUSES.SUCCESS,
    data: {
      plan
    }
  });
});
