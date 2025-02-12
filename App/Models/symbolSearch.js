const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SymbolSearchSchema = new Schema({
	    symbol_text : {
	  		type : 'string'
	  	},
	  	one_time : {
	  		type : 'number'
	  	},
	  	two_time : {
	  		type : 'number'
			},
		two_time_wild: {
			type: 'number'
		},
	  	three_time : {
	  		type : 'number'
	  	},
	  	three_time_wild : {
	  		type : 'number'
	  	},
	  	four_time : {
	  		type : 'number'
	  	},
	  	four_time_wild : {
	  		type : 'number'
	  	},
	  	five_time : {
	  		type : 'number'
	  	},
	  	five_time_wild : {
	  		type : 'number'
	  	},
	  	symbol: { 
	  		type : Schema.Types.ObjectId,
			ref : 'symbol',
	  		required: true 
	  	},
	    game: {
	    	type : Schema.Types.ObjectId,
			ref : 'game'
	    }
},{ collection: 'symbolSearch', versionKey: false });

mongoose.model('symbolSearch', SymbolSearchSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});