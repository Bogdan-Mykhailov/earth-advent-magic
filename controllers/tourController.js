import fs from 'fs';

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);

export const checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id *1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    })
  }
  next();
}

export const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours
    }
  });
};
export const getOneTour = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find(({ id }) => id === tourId);

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour
    }
  });
}
export const addTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
}
export const updateTour = (req, res) => {

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
}
export const deleteTour = (req, res) => {

  res.status(204).json({
    status: 'success',
    data: null
  });
}
