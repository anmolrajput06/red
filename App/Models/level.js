const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const levelSchema = new Schema({
			level: {
				type : 'number',
				default : ''
			},
			bonus: {
				type : 'number',
				default : ''
			},
			minimum: {
				type : 'number',
				default : ''
			},
			maximum : {
				type : 'number',
				default : ''
			},
			updatedAt : { type: Date, default: Date.now },
			createdAt : { type: Date, default: Date.now }
	},{ collection: 'level', versionKey: false });
mongoose.model('level', levelSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
 
