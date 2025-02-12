const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const betSchema = new Schema({
	playPoints : {
  		type : 'number',
  		required: true
  	},
    type: { 
        type : 'number',
        required: true 
    },
},{ collection: 'betModel', versionKey: false });

mongoose.model('betModel', betSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret.__v;
     }
});
