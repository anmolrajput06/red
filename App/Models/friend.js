const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const friendSchema = new Schema({
		request_from: {
            type: Schema.Types.ObjectId,
            ref: 'player'
        },
        request_to: {
            type: Schema.Types.ObjectId,
            ref: 'player'
        },
        status: {
            type: 'string', // pending or approved
            default:'pending'
        },
		updatedAt : { type: Date, default: Date.now },
		createdAt : { type: Date, default: Date.now }
	},{ collection: 'friend', versionKey: false });
mongoose.model('friend', friendSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
 
