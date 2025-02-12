const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const supportSchema = new Schema({
	player: {
		type: Schema.Types.ObjectId,
		ref : 'player',
		
		required: true
	},
	replies: {
		type: Schema.Types.ObjectId,
		ref : 'supportReply',
		via: 'support'
	},
	subject: {
		type: 'string',
  		required: true
	},
	message:{
		type: 'string',
  		required: true
	},
	read:{
		type: 'boolean',
	},
	status:{
		type: 'string',
		required: true
	},
	updatedAt : { type: Date, default: Date.now },
    createdAt : { type: Date, default: Date.now },
	},{ collection: 'support', versionKey: false });
mongoose.model('support', supportSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
 
