'use strict';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from './app.js';

process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception. Shutting down...');
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1)
  })
})

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

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server use port ${PORT}`);
});

process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection. Shutting down...');
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});
