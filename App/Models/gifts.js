const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GiftsSchema = new Schema({
  	name : {
  		 type: 'string',
  		 required: true
  	},
    chips: {
    	 type: 'number',
    	 required: true
    },
  	image: {
  		 type: 'string',
  		 required: true
  	},
  	valid_for : {
  		 type: 'number',
  		 required: true
  	}
},{ collection: 'gifts', versionKey: false });
mongoose.model('gifts', GiftsSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
 
