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
    minlength: 15,
  },
 
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  shipLabel: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'label',
    },
  ],
});

export default mongoose.model('parcel', parcelSchema); // exporting module, default only exports one module

