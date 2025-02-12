const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const loginLogSchema = new Schema({
			chips: {
				type : 'number',
				default : ''
			},
			day : {
				type : 'number',
				default : ''
			},
			status : {
				type : 'number',
				default : ''
			},
			updatedAt : { type: Date, default: Date.now },
			createdAt : { type: Date, default: Date.now }
	},{ collection: 'daybasedoffer', versionKey: false });
mongoose.model('dayBaseDoffer', loginLogSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
 
