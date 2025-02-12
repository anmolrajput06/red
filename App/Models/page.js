const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pageSchema = new Schema({
	title : {
  		type : 'string',
  		required: true
  	},
    uri: {
  		type: 'string',
  		required: true
  	},
  	body: {
  		type: 'string',
  		required: true
  	},
},{ collection: 'page', versionKey: false });

mongoose.model('page', pageSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});