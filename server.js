import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from './app.js';

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

app.listen(PORT, () => {
  console.log(`Server use port ${PORT}`);
});
