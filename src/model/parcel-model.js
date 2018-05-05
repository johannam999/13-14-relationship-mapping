import mongoose from 'mongoose'; // import mongoose from module, 

const parcelSchema = mongoose.Schema({ // create model with properties
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
  labels: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'label',
    },
  ],
}, {
  usePushEach: true,
});

export default mongoose.model('parcel', parcelSchema); // exporting module, default only exports one module

