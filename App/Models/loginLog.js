const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const loginLogSchema = new Schema({
			player: {
				type : 'string',
				default : ''
			},
			date: {
				type : Date,
				default : Date.now
			},
			ip: {
				type : 'string',
				default : ''
			},
			flag : {
				type : 'string',
				default : ''
			},
			client : {
				type : 'string',
				default : ''
			},
			updatedAt : { type: Date, default: Date.now },
			createdAt : { type: Date, default: Date.now }
	},{ collection: 'loginlog', versionKey: false });
mongoose.model('loginLog', loginLogSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
 
