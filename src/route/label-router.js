'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import Label from '../model/label-model';

const jsonParser = bodyParser.json();
const labelRouter = new Router();

labelRouter.post('/api/labels', jsonParser, (request, response, next) => {
  // TODO: Optional validation

  return new Label(request.body).save()
    .then((label) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      response.json(label);
    })
    .catch(next);
});

labelRouter.put('/api/labels/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Label.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedLabel) => {
      if (!updatedLabel) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code');
        return next(new HttpError(404, 'Label not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedLabel); 
    })
    .catch(next);
});

export default labelRouter;
