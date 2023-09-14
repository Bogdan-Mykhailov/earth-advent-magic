'use strict';
import mongoose from 'mongoose';
import { ROLES } from '../utils/constants.js';

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty!']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
  user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: `${ROLES.user}`,
    select: 'name photo'});
  next();
});

export const Review = mongoose.model('Review', reviewSchema);
