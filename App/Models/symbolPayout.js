const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SymbolPayoutSchema = new Schema({
	one_time : {
  		type : 'number',
  		required: true,
  		default : 0
  	},
  	two_time : {
  		type : 'number',
  		required: true,
  		default : 0
  	},
  	three_time : {
  		type : 'number',
  		required: true,
  		default : 0
  	},
  	four_time : {
  		type : 'number',
  		required: true,
  		default : 0
  	},
  	five_time : {
  		type : 'number',
  		required: true,
  		default : 0
  	},
  	//relation with symbol
  	symbol: { 
  		type : Schema.Types.ObjectId,
		  ref : 'symbol',
  		required: true 
  	},
    game: { 
    	type : Schema.Types.ObjectId,
		  ref : 'game',
      required: true 
    },
},{ collection: 'symbolPayout', versionKey: false });

mongoose.model('symbolPayout', SymbolPayoutSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});