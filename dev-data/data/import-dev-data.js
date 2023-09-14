import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Tour } from './../../models/Tour.js';
import { Review } from '../../models/Review.js';
import { User } from '../../models/User.js';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE
  .replace('<USERNAME>', process.env.DB_USERNAME)
  .replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }).then(() => console.log('DB connection successful!'));

//read file
const toursPath = path.join('dev-data', 'data', 'tours.json');
const tours = JSON.parse(fs.readFileSync(toursPath, 'utf-8'));

const usersPath = path.join('dev-data', 'data', 'users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

const reviewsPath = path.join('dev-data', 'data', 'reviews.json');
const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));

//import data in to db
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
