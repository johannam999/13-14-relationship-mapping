'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Parcel from '../model/parcel';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/parcels`;


const pCreateMockParcel = () => {
  return new Parcel({
    firstName: faker.lorem.words(10),
    lastName: faker.lorem.words(25),
    address: faker.lorem.words(40),
  }).save();// i get promise back a saved item
};

describe('api/parcels', () => {
  beforeAll(startServer);// this is a function but not envoking function
  afterAll(stopServer);
  afterEach(() => Parcel.remove({})); // delete database after testing done

  describe('POST api/parcels', () => {
    test('POST - it should respond with a 200 status', () => {
      const mockParcel = {
        firstName: faker.lorem.words(10),
        lastName: faker.lorem.words(25),
        address: faker.lorem.words(40),
      };
      return superagent.post(apiURL)
        .send(mockParcel)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.firstName).toEqual(mockParcel.firstName); 
          expect(response.body.lastName).toEqual(mockParcel.lastName);
          expect(response.body.address).toEqual(mockParcel.address);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();
        });
    });
    test('409 due to duplicate firstName', () => {
      return pCreateMockParcel()
        .then((parcel) => {
          const mockParcel = {
            firstName: parcel.firstName,
            lastName: parcel.lastName,
            address: parcel.address,
          };
          return superagent.post(apiURL)
            .send(mockParcel);
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


  describe('PUT api/parcels', () => {
    test('200 for successful PUT', () => {
      let parcelToUpdate = null;
      return pCreateMockParcel()
        .then((parcel) => {
          parcelToUpdate = parcel;
          return superagent.put(`${apiURL}/${parcel._id}`)
            .send({ firstName: 'JOANNA' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.firstName).toEqual('JOANNA');
          expect(response.body.lastName).toEqual(parcelToUpdate.lastName);
          expect(response.body._id).toEqual(parcelToUpdate._id.toString());
        });    
    });
    test('400 due to empty firstName ', () => {
      return pCreateMockParcel()
        .then((parcel) => {
          return superagent.put(`${apiURL}/${parcel._id}`)
            .send({ firstName: '' })
            .catch((error) => {
              expect(error.status).toEqual(400);
            });
        });
    });
    test('404 due to invalid id ', () => {
      return pCreateMockParcel()
        .then(() => {
          return superagent.put(`${apiURL}/badInput`)
            .send({ firstName: 'Joanna' })
            .catch((error) => {
              expect(error.status).toEqual(404);
            });
        });
    });
    test('409 due to duplicate firstName', () => {
      return pCreateMockParcel()
        .then((parcel) => {
          return superagent.put(`${apiURL}/${parcel._id}`)
            .send({ firstName: parcel.firstName })
            .catch((error) => {
              expect(error.status).toEqual(409);
            });
        });
    });
  });

  describe('GET /api/parcels', () => {
    test('200', () => {
      let tempParcel = null;
      return pCreateMockParcel()
        .then((parcel) => {
          tempParcel = parcel;
          return superagent.get(`${apiURL}/${parcel._id}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toEqual(tempParcel._id.toString());
            });
        });
    });
    test('404 due to invalid id ', () => {
      return pCreateMockParcel()
        .then(() => {
          return superagent.get(`${apiURL}/invalidId`)
            .catch((error) => {
              expect(error.status).toEqual(404);
            });
        });
    });
    test('404 due to empty id ', () => {
      return pCreateMockParcel()
        .then(() => {
          return superagent.get(`${apiURL}/`)
            .catch((error) => {
              expect(error.status).toEqual(404);
            });
        });
    });
    test('400 due to bad request ', () => {
      return pCreateMockParcel()
        .then((parcel) => {
          return superagent.get(`${apiURL}/${parcel._id}`)
            .catch((error) => {
              expect(error.status).toEqual(400);
            });
        });
    });
  });

  describe('DELETE /api/parcels', () => {
    test('204', () => {
      return pCreateMockParcel()
        .then((parcel) => {
          return superagent.delete(`${apiURL}/${parcel._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
  });
  test('404 due to invalid id ', () => {
    return pCreateMockParcel()
      .then(() => {
        return superagent.get(`${apiURL}/invalidId`)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
  });
});
  
