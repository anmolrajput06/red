const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocumentSchema = new Schema({
      playerId : {
      	type: 'string',
	    default: ''
      },
      document_type : {
	    type: 'string',
	    default: ''
      },
      other_document : {
      	type: 'string',
	    default: ''
      },
      take_photo : {
      	type: 'string',
	    default: ''
      },
      document : {
      	type: 'string',
	    default: ''
      },
},{ collection: 'uploadDocument', versionKey: false });

mongoose.model('uploadDocument', DocumentSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});