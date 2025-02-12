const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reelSchema = new Schema({
	name : { 
    	type: 'string',
    	required: true
    },
	game: {
		type : Schema.Types.ObjectId,
		ref : 'game'
	},
    symbols : {
    	type : Schema.Types.ObjectId,
		ref : 'symbol',
		via: 'reels',
        through: 'symbolreel'
    },
},{ collection: 'reel', versionKey: false });

mongoose.model('reel', reelSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});