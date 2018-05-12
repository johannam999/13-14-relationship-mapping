'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateParcelMock } from './lib/parcel-mock';
import { pCreateLabelMock, pRemoveLabelMock } from './lib/label-mock';


const apiURL = `http://localhost:${process.env.PORT}/api/labels`;

describe('/api/labels', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveLabelMock);

  describe('POST /api/labels', () => {
    test('200 status code in creation', () => { // the parent should always exist before the child so to test creating the label we need a fake category
      return pCreateParcelMock()
        .then((parcelMock) => {
          const labelToPost = {
            firstName: faker.lorem.words(5),
            lastName: faker.lorem.words(10),
            address: faker.lorem.words(14),
            parcel: parcelMock._id, 
          };
          return superagent.post(apiURL) // sending the mock to the api (preHOOK)
            .send(labelToPost)
            .then((response) => { 
              expect(response.status).toEqual(200);
              expect(response.body.firstName).toEqual(labelToPost.firstName); 
              expect(response.body.address).toEqual(labelToPost.address);
              expect(response.body._id).toBeTruthy();
            });
        });
    });
    test('409 due to duplicate firstName', () => {
      return pCreateParcelMock()
        .then((mock) => {
          const labelMock = {
            firstName: faker.lorem.words(5),
            lastName: faker.lorem.words(10),
            address: faker.lorem.words(14),
            parcel: mock._id,
          };
          return superagent.post(apiURL)
            .send(labelMock);
        })
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
  

    test('400 due to lack of firstName', () => {
      return pCreateParcelMock()
        .then((label) => {
          return superagent.put(`${apiURL}/${label._id}`)
            .send({ firstName: '' })
            .catch((error) => {
              expect(error.status).toEqual(400);
            });
        });
    });
  });

  describe('PUT /api/labels', () => {
    test('200 status code in creation', () => { // the parent should always exist before the child so to test creating the card we need a fake parcel
      let labelToUpdate = null;
      return pCreateLabelMock()
        .then((mock) => {
          labelToUpdate = mock.label;
          return superagent.put(`${apiURL}/${mock.label._id}`) 
            .send({ firstName: 'Bart' });
        })
        .then((response) => { 
          expect(response.status).toEqual(200);
          expect(response.body.firstName).toEqual('Bart');
          expect(response.body.lastName).toEqual(labelToUpdate.lastName);
          expect(response.body.address).toEqual(labelToUpdate.address);
        });
    });
    test('404 due to empty id ', () => {
      return pCreateLabelMock()
        .then(() => {
          return superagent.put(`${apiURL}/`)
            .catch((error) => {
              expect(error.status).toEqual(404);
            });
        });
    });


    describe('GET /api/labels', () => {
      test('200', () => {
        let testLabel = null;
        return pCreateLabelMock()
          .then((mock) => {
            testLabel = mock.label;
            return superagent.get(`${apiURL}/${testLabel._id}`)
              .then((response) => {
                expect(response.status).toEqual(200);
                expect(response.body._id).toEqual(testLabel._id.toString());
              });
          });
      });
      test('404 due to invalid id', () => {
        return pCreateLabelMock()
          .then(() => {
            return superagent.get(`${apiURL}/invalidId`)
              .catch((error) => {
                expect(error.status).toEqual(404);
              });
          });
      });
   
    // test('400 bad request', () => {
    //   return pCreateLabelMock()
    //     .then((label) => {
    //       return superagent.get(`${apiURL}/${label._id}`)
    //         .catch((error) => {
    //           expect(error.status).toEqual(400);
    //         });
    //     });
    // });
    });
    describe('DELETE /api/labels', () => {
      test('204', () => {
        return pCreateLabelMock()
          .then((mock) => {
            return superagent.delete(`${apiURL}/${mock.label._id}`);
          })
          .then((response) => {
            expect(response.status).toEqual(204);
          });
      });
      test('404 due to no label ', () => {
        return superagent.delete(`${apiURL}/invalidId`)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
    });
  });
});
