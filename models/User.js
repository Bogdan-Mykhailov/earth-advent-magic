'use strict';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tel us your name!'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm a password'],
    validate: {
      // this only works on create and save
      validator: function(pass) {
        return pass === this.password;
      },
      message: 'Passwords are not the same!'
    }
  }
});

userSchema.pre('save', async function(next) {
  // Only run this fn if pass was modified
  if (!this.isModified('password')) {
    return next();
  }
  // Hash the pass with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete pass confirm field
  this.passwordConfirm = undefined;
  next();
});

export const User = mongoose.model('User', userSchema);
