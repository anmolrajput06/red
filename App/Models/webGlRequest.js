const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pageSchema = new Schema({
	email : {
  		type : 'string',
  		// required: true
  	},
    global_ip: {
  		type: 'string',
  		required: true
  	},
  	userId: {
  		type: 'string',
  		required: true
  	},
		themeId: {
  		type: 'string',
  		required: true
  	},
		createdAt : { type: Date, default: Date.now },
},{ collection: 'webGlRequest', versionKey: false });

mongoose.model('webGlRequest', pageSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
