'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Parcel from '../model/parcel'; 
import logger from '../lib/logger';


const jsonParser = bodyParser.json();

const parcelRouter = new Router();

parcelRouter.post('/api/parcels', jsonParser, (request, response, next) => {
  if (!request.body.firstName) {
    logger.log(logger.ERROR, 'parcel-ROUTER: responding with 400');
    return next(new HttpErrors(400, 'firstName is required'));
  }
  return new Parcel(request.body).save()
    .then(parcel => response.json(parcel))
    .catch(next);
});

parcelRouter.put('/api/parcels/:id', jsonParser, (request, response, next) => {
 
  const options = { runValidators: true, new: true };
  return Parcel.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedParcel) => {
      if (!updatedParcel) {
        logger.log(logger.ERROR, 'PARCEL ROUTER: responding with 404 status code, no updatedParcel');
        return next(new HttpErrors(404, 'parcel not found'));
      }
      logger.log(logger.INFO, 'GET -  responding with a 200 status code');
      return response.json(updatedParcel);
    })
    .catch(next);
});

parcelRouter.get('/api/parcels/:id', (request, response, next) => {
  return Parcel.findById(request.params.id)
    .then((parcel) => {
      if (!parcel) {
        logger.log(logger.ERROR, 'PARCEL ROUTER: responding with 404 status code, no parcel');
        return next(new HttpErrors(404, 'parcel not found'));
      }
      logger.log(logger.INFO, ' PARCEL ROUTER: -  responding with a 200 status code');
      logger.log(logger.INFO, `PARCEL ROUTER: ${JSON.stringify(parcel)}`);
      return response.json(parcel);
    })
    .catch(next);
});

parcelRouter.delete('/api/parcels/:id', (request, response, next) => {
  return Parcel.findByIdAndRemove(request.params.id)
    .then((parcel) => {
      if (!parcel) {
        logger.log(logger.ERROR, 'PARCEL ROUTER: responding with 404 status code, no parcel');
        return next(new HttpErrors(404, 'parcel not found'));
      }
      logger.log(logger.INFO, ' PARCEL ROUTER: -  responding with a 200 status code');
      return response.sendStatus(204);
    });
});


export default parcelRouter;

