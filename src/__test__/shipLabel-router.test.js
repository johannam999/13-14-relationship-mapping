'use strict';

import faker from 'faker';
import superagent from 'superagent';
import ShipLabel from '../model/shipLabel';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/labels`;


const pCreateMockLabel = () => {
  return new ShipLabel({
    firstName: faker.lorem.words(10),
    lastName: faker.lorem.words(25),
    address: faker.lorem.words(40),
  }).save();// i get promise back a saved item
};

describe('api/labels', () => {
  beforeAll(startServer);// this is a function but not envoking function
  afterAll(stopServer);
  afterEach(() => ShipLabel.remove({})); // delete database after testing done

  describe('POST api/labels', () => {
    test('POST - it should respond with a 200 status', () => {
      const mockLabel = {
        firstName: faker.lorem.words(10),
        lastName: faker.lorem.words(25),
        address: faker.lorem.words(40),
      };
      return superagent.post(apiURL)
        .send(mockLabel)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.firstName).toEqual(mockLabel.firstName); 
          expect(response.body.lastName).toEqual(mockLabel.lastName);
          expect(response.body.address).toEqual(mockLabel.address);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();
        });
    });
    test('409 due to duplicate firstName', () => {
      return pCreateMockLabel()
        .then((label) => {
          const mockLabel = {
            firstName: label.firstName,
            lastName: label.lastName,
            address: label.address,
          };
          return superagent.post(apiURL)
            .send(mockLabel);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });

    test('400 due to lack of firstName', () => {
      return superagent.post(apiURL)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('400 due to bad json', () => {
      return superagent.post(apiURL)
        .send('{')
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });


  describe('PUT api/labels', () => {
    test('200 for successful PUT', () => {
      let labelToUpdate = null;
      return pCreateMockLabel()
        .then((label) => {
          labelToUpdate = label;
          return superagent.put(`${apiURL}/${label._id}`)
            .send({ firstName: 'JOANNA' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.firstName).toEqual('JOANNA');
          expect(response.body.lastName).toEqual(labelToUpdate.lastName);
          expect(response.body._id).toEqual(labelToUpdate._id.toString());
        });    
    });
    test('400 due to invalid request ', () => {
      return pCreateMockLabel()
        .then((label) => {
          return superagent.put(`${apiURL}/${label._id}`)
            .send({ firstName: '' })
            .catch((error) => {
              expect(error.status).toEqual(400);
            });
        });
    });
    test('404 due to invalid id ', () => {
      return pCreateMockLabel()
        .then(() => {
          return superagent.put(`${apiURL}/badInput`)
            .send({ firstName: 'Joanna' })
            .catch((error) => {
              expect(error.status).toEqual(404);
            });
        });
    });
    test('409 due to duplicate firstName', () => {
      return pCreateMockLabel()
        .then((label) => {
          return superagent.put(`${apiURL}/${label._id}`)
            .send({ firstName: label.firstName })
            .catch((error) => {
              expect(error.status).toEqual(409);
            });
        });
    });
  });

  describe('GET /api/labels', () => {
    test('200', () => {
      let tempLabel = null;
      return pCreateMockLabel()
        .then((label) => {
          tempLabel = label;
          return superagent.get(`${apiURL}/${label._id}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toEqual(tempLabel._id.toString());
            });
        });
    });
    test('404 due to invalid id ', () => {
      return pCreateMockLabel()
        .then(() => {
          return superagent.get(`${apiURL}/invalidId`)
            .catch((error) => {
              expect(error.status).toEqual(404);
            });
        });
    });
    test('400 due to bad request ', () => {
      return pCreateMockLabel()
        .then((label) => {
          return superagent.get(`${apiURL}/${label._id}`)
            .catch((error) => {
              expect(error.status).toEqual(400);
            });
        });
    });
  });

  describe('DELETE /api/labels', () => {
    test('204', () => {
      return pCreateMockLabel()
        .then((label) => {
          return superagent.delete(`${apiURL}/${label._id}`)
            .then((response) => {
              expect(response.status).toEqual(204);
            });
        });
    });
    test('404 due to invalid id ', () => {
      return pCreateMockLabel()
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
