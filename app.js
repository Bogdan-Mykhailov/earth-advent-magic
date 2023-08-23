'use strict';
import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    },
  })
})

app.listen(PORT, () => {
  console.log(`Server use port ${PORT}`);
});
