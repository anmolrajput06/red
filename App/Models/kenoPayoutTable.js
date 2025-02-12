const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const kenoPayoutTableSchema = new Schema({
	selectedCount : {
  		type : 'number',
  		required: true
  	},
    payouts: { 
        type : 'object',
        required: true 
    },
},{ collection: 'kenoPayoutTable', versionKey: false });

mongoose.model('kenoPayoutTable', kenoPayoutTableSchema);