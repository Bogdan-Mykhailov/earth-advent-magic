'use strict';
import { filterObj, PHOTO, STATUSES, USERS_IMG_DIRECTORY } from '../utils/constants.js';
import { User } from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/error.js';
import { deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';
import multer from 'multer';
import sharp from 'sharp';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    const message = 'Not an image! Please upload only images.'
    callback(new AppError(message, 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

export const uploadUserPhoto = upload.single(PHOTO);

export const resizeUserPhoto = (req, res, next) => {

  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${USERS_IMG_DIRECTORY}/${req.file.filename}`);

  next();
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}
export const updateMe = catchAsync(async (req, res, next) => {
  // create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    const message = 'This route is not for password updates. Please use /updateMyPassword';
    return next(new AppError(message, 400));
  }
  // filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }
  // update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    });

  res.status(200).json({
    status: STATUSES.SUCCESS,
    data: {
      user: updatedUser
    }
  });
});

export const deleteMe = catchAsync(async (req,res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: STATUSES.SUCCESS,
    data: null
  });
});

export const createUser = (req, res) => {
  res.status(500).json({
    status: STATUSES.ERROR,
    message: 'This route is not defined! Please use /signup instead'
  });
};

export const getAllUsers = getAll(User);
export const getOneUser = getOne(User);
// do not update password with this
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
