'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateParcelMock } from './lib/parcel-mock';
import { pCreateLabelMock, pRemoveLabelMock } from './lib/label-mock';


const apiURL = `http://localhost:${process.env.PORT}/api/parcels`;

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
            });
        });
    });
  });
  // describe('PUT /api/labels', () => {
  //   test('200 status code in creation', () => { // the parent should always exist before the child so to test creating the card we need a fake parcel
  //     let labelToUpdate = null;
  //     return pCreateLabelMock()
  //       .then((mock) => {
  //         labelToUpdate = mock.label;
  //         return superagent.put(`${apiURL}/${mock.label._id}`) // sending the mock to the api (preHOOK)
  //           .send({ firstName: 'Bart' });
  //       })
  //       .then((response) => { 
  //         expect(response.status).toEqual(200);
  //         expect(response.body.firstName).toEqual('Bart');
  //         expect(response.body.lastName).toEqual(labelToUpdate.content);
  //         expect(response.body.address).toEqual(labelToUpdate.address);
  //       });
  //   });
  // });
});

