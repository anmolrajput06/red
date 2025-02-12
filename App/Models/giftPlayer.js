const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const giftPlayerSchema = new Schema({
    gift: {
      	type : Schema.Types.ObjectId,
  		  ref : 'gift',
    		required: true
  	},
  	player: {
    		type : Schema.Types.ObjectId,
  		  ref : 'player',
    		required: true
  	},
    type: {
        type: 'string',
        enum: ['sender', 'receiver'],
        required: true
		},
    game: {
        type: 'string',
        // enum: ['Slots', 'Poker'],
        required: true
    },
},{ collection: 'giftPlayer', versionKey: false });

mongoose.model('giftPlayer', giftPlayerSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});