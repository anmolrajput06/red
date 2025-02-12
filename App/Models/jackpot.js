const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jackpotSchema = new Schema({
	name : {
  		type : 'string',
  		required: true
  	},
    game: { 
    	type : Schema.Types.ObjectId,
		ref : 'game',
      	required: true 
    },
    step_chips 	: { 
    	type: 'number',
    	required: true
    },
	margin_chips: { 
		type: 'number',
		required: true
	},
	start_chips	: { 
		type: 'number',
		required: true
	},
	end_chips	: { 
		type: 'number',
		required: true
	},
},{ collection: 'jackpot', versionKey: false });

mongoose.model('jackpot', jackpotSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});