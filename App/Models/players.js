const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PlayerSchema = new Schema({
        first_name : {
			type : 'string',
			default : ''
		},
		last_name : {
			type : 'string',
			default : ''
		},
		email : {
			type : 'string',
			default : ''
		},
		birth_date:{
			type : Date,
			default : ''
		},
		gender : {
			type : 'string',
			default : ''
		},
		address : {
			type : 'string',
			default : ''
		},
		pincode : {
			type : 'number',
			default : ''
		},
		mobile : {
			type : 'number',
			default : ''
		},
		username : {
			type : 'string',
			default : ''
		},
		playerChips:{
			type: 'number',
			default: 0
		}
      
},{ collection: 'players', versionKey: false });

mongoose.model('players', PlayerSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});