const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const loginLogSchema = new Schema({
			message: {
				type: 'string',
				required: true
			},
			isRead: {
				type: 'boolean',
				default: false
			},
			sender: {
				type: Schema.Types.ObjectId,
				ref: 'player'
			},
			reciever: {
				type: Schema.Types.ObjectId, 
				ref: 'player'
			},
			updatedAt : { type: Date, default: Date.now },
			createdAt : { type: Date, default: Date.now }
	},{ collection: 'message', versionKey: false });
mongoose.model('message', loginLogSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
 
