'use strict';

import faker from 'faker';
import Label from '../../model/label-model';
import * as parcelMock from './parcel-mock';


const pCreateLabelMock = () => {
  const resultMock = {};
  
  return parcelMock.pCreateParcelMock()
    .then((createdParcel) => {
      resultMock.parcel = createdParcel;
    
      return new Label({
        firstName: faker.lorem.words(5),
        lastName: faker.lorem.words(10),
        address: faker.lorem.words(17),
        parcel: createdParcel._id,   
      }).save();
    })
    .then((newLabel) => {
      resultMock.label = newLabel;
      return resultMock;
    });
};
const pRemoveLabelMock = () => Promise.all([
  // method returns single promise that resolves when all of the promises have resolved
  Label.remove({}),
  parcelMock.pRemoveParcelMock(),
]);

export { pCreateLabelMock, pRemoveLabelMock };
