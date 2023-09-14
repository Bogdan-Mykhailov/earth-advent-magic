'use strict';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/error.js';
import { STATUSES } from '../utils/constants.js';
import { Tour } from '../models/Tour.js';

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
