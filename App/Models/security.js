const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const securitySchema = new Schema({
			ip: {
				type: 'string',
				default: ''
			},
			status: {
				type: 'string',
				default: 'inactive'
			},
			flag: {
				type: 'string',
				default: ''
			}
	},{ collection: 'security', versionKey: false });
mongoose.model('security', securitySchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
 
