const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const payoutNameSchema = new Schema({
	name : {
  		type : 'string',
  		required: true
  	},
    game: { 
    	type : Schema.Types.ObjectId,
		ref : 'game',
      	required: true 
    },
    minimum: {
        type: 'number',
        required: true
    },
    maximum: {
        type: 'number',
        required: true
    },
},{ collection: 'payoutName', versionKey: false });

mongoose.model('payoutName', payoutNameSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});