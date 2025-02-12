const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const symbolSchema = new Schema({
	gameId: {
		type : Schema.Types.ObjectId,
		ref : 'game'
	},
    symbol : { 
    	type: 'string',
    	required: true
    },
    symbol_type : { 
		type: 'string',
		enum: ['symbol', 'bonus', 'wild'], 
		required: true,
		default : 'symbol'
	},
    image : { 
        type: 'string',
    	default : ''
    },
    gif : { 
        type: 'string',
        default : ''
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
    indexValue:{
        type : 'number',
        required: true,
    },
    updatedAt : { type: Date, default: Date.now() },
    createdAt : { type: Date, default: Date.now() }
},{ collection: 'symbol', versionKey: false });

mongoose.model('symbol', symbolSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});