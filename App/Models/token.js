const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TokenSchema = new Schema({
			user: {
				model: {
					type: Schema.Types.ObjectId,
					ref: 'user'
				}
			},
			token: {
				type: 'string',
				required: true
			},
			type: {
				type: 'string',
				required: true
			},
			is_revoked:{
				type:'boolean',
				required:true
			}

},{ collection: 'token', versionKey: false });
mongoose.model('token', TokenSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});
 