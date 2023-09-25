'use strict';
import { Tour } from '../models/Tour.js';
import { REVIEWS, STATUSES, TOURS_IMG_DIRECTORY } from '../utils/constants.js';
import { catchAsync } from '../utils/catchAsync.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';
import { AppError } from '../utils/error.js';
import multer from 'multer';
import sharp from 'sharp';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    const message = 'Not an image! Please upload only images.';
    callback(new AppError(message, 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

export const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

export const resizeTourImg = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next();
  }

  // covet image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${TOURS_IMG_DIRECTORY}/${req.body.imageCover}`);

  // images
  req.body.images = [];

  await Promise.all(req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`${TOURS_IMG_DIRECTORY}/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

export const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

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

export const getAllTours = getAll(Tour);
export const getOneTour = getOne(Tour, { path: REVIEWS });
export const createTour = createOne(Tour);
export const updateTour = updateOne(Tour);
export const deleteTour = deleteOne(Tour);

export const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    const message = 'Please provide latitude and longitude in the format lat,lng.';
    next(new AppError(message, 400));
  }

  const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

  res.status(200).json({
    status: STATUSES.SUCCESS,
    result: tours.length,
    data: {
      data: tours
    }
  });
});

export const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    const message = 'Please provide latitude and longitude in the format lat,lng.';
    next(new AppError(message, 400));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: STATUSES.SUCCESS,
    data: {
      data: distances
    }
  });
});
