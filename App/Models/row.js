const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rowSchema = new Schema({
	name : {
  		type : 'string',
  		required: true
  	},
    game: { 
    	type : Schema.Types.ObjectId,
		ref : 'game',
      	required: true 
    },
},{ collection: 'row', versionKey: false });

mongoose.model('row', rowSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});