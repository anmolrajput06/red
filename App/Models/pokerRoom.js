const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pokerRoomSchema = new Schema({
		name 		: {
			type: 'string',
			required: true 
		},
 		smallBlind 	: {
 			type: 'number',
 			required: true 
 		},
 		bigBlind 	: {
 			type: 'number',
 			required: true 
 		},
 		minPlayers 	: {
 			type: 'number',
 			required: true 
 		},
 		maxPlayers 	: {
 			type: 'number',
 			required: true 
 		},
 		minBuyIn 	: {
 			type: 'number',
 			required: true 
 		},
		maxBuyIn 	: {
			type: 'number',
			required: true 
		},
		turnTime 	: {
			type: 'number',
			required: true 
		},
 		type 		: {
 			type: 'string',
 			required: true 
 		},
 		status 		: {
 			type: 'string',
 			required: true 
 		},
 		currentPlayer: {
 			type: 'number'},
 		dealer 		: {
 			type: 'number',
 			required: true 
 		},
 		players		: {
 			type: 'array' 
 		},
 		gameWinners	: {
 			type: 'array' 
 		},
 		gameLosers	: {
 			type: 'array' 
 		},
 		turnBet		: {
 			type: 'array' 
 		},
 		game		: {
 			type: 'array' 
 		},
 		jackpot		: {
 			type: 'number' 
 		},
},{ collection: 'pokerRoom', versionKey: false });

mongoose.model('pokerRoom', pokerRoomSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});