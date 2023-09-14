'use strict';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/error.js';
import { STATUSES } from '../utils/constants.js';
import { APIFeatures } from '../utils/api-features.js';

export const deleteOne = (Model) => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError(
      `No document found with that ID!`,
      404
    ));
  }

  res.status(204).json({
    status: STATUSES.SUCCESS,
    data: null
  });
});

export const updateOne = (Model) => catchAsync(async (req, res, next) => {
  const updatedDoc = await Model.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedDoc) {
    const message = `No document found with that ID!`;
    return next(new AppError(message, 404));
  }

  res.status(200).json({
    status: STATUSES.SUCCESS,
    data: {
      data: updatedDoc
    }
  });
});

export const createOne = (Model) => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);

  res.status(201).json({
    status: STATUSES.SUCCESS,
    data: {
      data: doc
    }
  });
});

export const getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);

  if(populateOptions) {
    query = query.populate(populateOptions);
  }
  const doc = await query;

  if (!doc) {
    const message = `No document found with that ID!`;
    return next(new AppError(message, 404));
  }

  res.status(200).json({
    status: STATUSES.SUCCESS,
    data: {
      data: doc
    }
  });
});

export const getAll = (Model) => catchAsync(async (req, res, next) => {
  //to allow for nested get reviews on tour
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  // execute query
  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const docs = await features.query;
  // const docs = await features.query.explain();

  // send response
  res.status(200).json({
    status: STATUSES.SUCCESS,
    results: docs.length,
    data: {
      data: docs
    }
  });
});
