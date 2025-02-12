const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const loginHistorySchema = new Schema({
	 		player: {
				// model: 'player',
				// required: true 
				type: 'string',
				default: ''
			},
			ip: {
				type: 'string',
				default: ''
			},
			date: {
				type: 'string',
				default: ''
			},
			flag: {
				type: 'string',
				default: ''
			},
			client: {
				type: 'string',
				default: ''
			}

},{ collection: 'loginhistory', versionKey: false });

mongoose.model('loginHistory', loginHistorySchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});