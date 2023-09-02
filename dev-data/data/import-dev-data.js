import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Tour } from './../../models/Tour.js';

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
const filePath = path.join('dev-data', 'data', 'tours-simple.json');
const tours = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//import data in to db
const importData = async () => {
  try {
    await Tour.create(tours);
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
