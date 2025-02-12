const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const betSchema = new Schema({
	jackpot_eligible : {
  		type : 'string',
  		required: true
  	},
    game: { 
    	type : Schema.Types.ObjectId,
		   ref : 'game',
      	required: true 
    },
    chips: {
  		type: 'number',
  		required: true
  	},
},{ collection: 'bet', versionKey: false });

mongoose.model('bet', betSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});