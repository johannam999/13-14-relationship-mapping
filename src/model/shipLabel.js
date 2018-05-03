import mongoose from 'mongoose'; // import mongoose from module, 

const shipLabelSchema = mongoose.Schema({ // create model with properties
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
  // postOffice: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId, ref: 'label',
  //   },
  // ],
});

export default mongoose.model('label', shipLabelSchema); // exporting module, default only exports one module

