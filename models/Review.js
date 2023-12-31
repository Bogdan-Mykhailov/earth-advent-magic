'use strict';
import mongoose from 'mongoose';
import { ROLES } from '../utils/constants.js';
import { Tour } from './Tour.js';

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: `${ROLES.user}`,
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats.length > 0 ? stats[0].nRating : 0,
    ratingsAverage: stats.length > 0 ? stats[0].avgRating : 4.5
  });
};

reviewSchema.post('save', function() {
  // this point to current review
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^fingOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function(docs) {
  if (docs) {
    await docs.constructor.calcAverageRatings(docs.tour);
  }
});

export const Review = mongoose.model('Review', reviewSchema);
