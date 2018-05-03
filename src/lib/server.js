'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import parcelRouter from '../route/parcel-router';
import errorMiddleware from './error-middleware';

const app = express(); // assign express to app
let server = null;


app.use(parcelRouter);

app.all('*', (request, response) => { 
  logger.log(logger.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    })
    .catch((err) => {
      logger.log(logger.ERROR, `Something happened, ${JSON.stringify(err)}`);
    });
};

const stopServer = () => { 
  return mongoose.disconnect() 
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off'); // we can add json.strigify here to see the error
      });
    })
    .catch((err) => {
      logger.log(logger.ERROR, `something happened${JSON.stringify(err)}`);
    });
};

// server turns on and off right after executing the test

export { startServer, stopServer };
