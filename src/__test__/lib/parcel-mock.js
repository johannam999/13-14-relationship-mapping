'use strict';

import faker from 'faker';
import Parcel from '../../model/parcel-model';

const pCreateParcelMock = () => {
  return new Parcel({
    firstName: faker.lorem.words(5),
    lastName: faker.lorem.words(10),
    address: faker.lorem.words(17),
  }).save();
};

const pRemoveParcelMock = () => Parcel.remove({});

export { pCreateParcelMock, pRemoveParcelMock };
