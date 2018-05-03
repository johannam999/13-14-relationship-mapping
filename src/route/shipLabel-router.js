'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import ShipLabel from '../model/shipLabel'; 
import logger from '../lib/logger';


const jsonParser = bodyParser.json();

const shipLabelRouter = new Router();

shipLabelRouter.post('/api/labels', jsonParser, (request, response, next) => {
  if (!request.body.firstName) {
    logger.log(logger.ERROR, 'LABEL-ROUTER: responding with 400');
    return next(new HttpErrors(400, 'firstName is required'));
  }
  return new ShipLabel(request.body).save()
    .then(label => response.json(label))
    .catch(next);
});

shipLabelRouter.put('/api/labels/:id', jsonParser, (request, response, next) => {
 
  const options = { runValidators: true, new: true };
  return ShipLabel.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedLabel) => {
      if (!updatedLabel) {
        logger.log(logger.ERROR, 'LABEL ROUTER: responding with 404 status code, no updatedLabel');
        return next(new HttpErrors(404, 'label not found'));
      }
      logger.log(logger.INFO, 'GET -  responding with a 200 status code');
      return response.json(updatedLabel);
    })
    .catch(next);
});

shipLabelRouter.get('/api/labels/:id', (request, response, next) => {
  return ShipLabel.findById(request.params.id)
    .then((label) => {
      if (!label) {
        logger.log(logger.ERROR, 'LABEL ROUTER: responding with 404 status code, no label');
        return next(new HttpErrors(404, 'label not found'));
      }
      logger.log(logger.INFO, ' LABEL ROUTER: -  responding with a 200 status code');
      logger.log(logger.INFO, `LABEL ROUTER: ${JSON.stringify(label)}`);
      return response.json(label);
    })
    .catch(next);
});

shipLabelRouter.delete('/api/labels/:id', (request, response, next) => {
  return ShipLabel.findByIdAndRemove(request.params.id)
    .then((label) => {
      if (!label) {
        logger.log(logger.ERROR, 'LABEL ROUTER: responding with 404 status code, no label');
        return next(new HttpErrors(404, 'label not found'));
      }
      logger.log(logger.INFO, ' LABEL ROUTER: -  responding with a 200 status code');
      return response.sendStatus(204);
    });
});


export default shipLabelRouter;

