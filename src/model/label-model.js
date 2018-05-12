'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Parcel from '../model/parcel-model';

const labelSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: true,
  },
  lastName: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    minlength: 10,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  parcel: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'parcel',
  },
});

function labelPreHook(done) {
  return Parcel.findById(this.parcel)
    .then((parcelFound) => {
      if (!parcelFound) {
        throw new HttpError(404, 'parcel not found');
      }
      
      parcelFound.labels.push(this._id);
      return parcelFound.save();
    })
    .then(() => done()) // done without any arguments mean success - save
    .catch(done);
}

const labelPostHook = (document, done) => {
  return Parcel.findById(document.parcel)
    .then((parcelFound) => {
      if (!parcelFound) {
        throw new HttpError(500, 'parcel not found');
      }
      parcelFound.labels = parcelFound.labels.filter((label) => {
        return label._id.toString() !== document._id.toString();
      });
    })
    .then(() => done()) 
    .catch(done);
};

labelSchema.pre('save', labelPreHook);
labelSchema.post('remove', labelPostHook);

export default mongoose.model('label', labelSchema);
