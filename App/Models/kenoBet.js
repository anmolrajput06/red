const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const kenoBetSchema = new Schema({
	denominationNumber : {
  		type : 'number',
  		required: true
  	},
    betModel: { 
        type : 'object',
        required: true 
    },
},{ collection: 'kenoBet', versionKey: false });

mongoose.model('kenoBet', kenoBetSchema);
