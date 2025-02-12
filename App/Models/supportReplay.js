const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const supportReplaySchema = new Schema({
	player: {
		type: Schema.Types.ObjectId,
		ref : 'player',
		required: true
	},
	support: {
		type: Schema.Types.ObjectId,
		ref : 'support',
		required: true
	},
	message: {
		type: 'string',
  		required: true
	},
	read:{
		type: 'boolean',
	},
	updatedAt : { type: Date, default: Date.now },
    createdAt : { type: Date, default: Date.now },
	},{ collection: 'supportReplay', versionKey: false });
mongoose.model('supportReplay', supportReplaySchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
 
