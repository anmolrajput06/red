const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SettingSchema = new Schema({
			minStack: {
				type: 'number',
				default: 0
			},
			maxStack: {
				type: 'number',
				default: 0
			},
			flag: {
				type: 'string',
				default: ''
			},
			gameType:{
				type: 'string',
				default: ''
			},
	},{ collection: 'stacks', versionKey: false });
mongoose.model('stacks', SettingSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
 
