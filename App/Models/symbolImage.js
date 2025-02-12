const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const symbolImageSchema = new Schema({
    symbol: {
		type : Schema.Types.ObjectId,
		ref : 'symbol'
	},
	image : { 
        type: 'string',
    	default : ''
    },
    gif : { 
        type: 'string',
        default : ''
    },
    game: {
        type : Schema.Types.ObjectId,
        ref : 'game'
    },
},{ collection: 'symbolImage', versionKey: false });

mongoose.model('symbolImage', symbolImageSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});