'use strict';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/error.js';
import { STATUSES } from '../utils/constants.js';

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
