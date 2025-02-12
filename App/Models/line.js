const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const lineSchema = new Schema({
	  name : {
  		type : 'string',
  		required: true
  	},
    game: { 
    	type : Schema.Types.ObjectId,
		  ref : 'game',
      required: true 
    },
    name : {
  		type: 'string',
  		required: true
  	},
  	status: {
  		type: 'boolean',
  		default 	: true
  	},
  	matrix:{
      type:'object',
      // default: [],
      // required:true
    },
	indexValue:{
		type:'number',
		default:0
	},
	image:{
		type:'string',
		default:''
	},
},{ collection: 'line', versionKey: false });

mongoose.model('line', lineSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});