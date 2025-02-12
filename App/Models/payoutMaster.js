const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PayoutMasterSchema = new Schema({
	payoutRatio : {
		type: 'number',
		required: true,
		default: 0
	},
	jackpotPlan : {
		type: 'number',
		required: true,
		default: 0
	},
	desiredIncomeRatio : {
		type: 'number',
		required: true,
		default: 0
	},
	totalInward : {
		type: 'number',
		required: true,
		default: 0
	},
	totalOutward : {
		type: 'number',
		required: true,
		default: 0
	},
	totalIncome : {
		type: 'number',
		required: true,
		default: 0
	},
	desiredIncome : {
		type: 'number',
		required: true,
		default: 0
	},
	differenceIncome : {
		type: 'number',
		required: true,
		default: 0
	},
	differenceRatio : {
		type: 'number',
		required: true,
		default: 0
	},
	updatedAt : { 
		type: Date, 
		default: Date.now 
	},
	createdAt : { 
		type: Date,
		default: Date.now 
	}
},{ collection: 'payoutMaster', versionKey: false });
mongoose.model('payoutMaster', PayoutMasterSchema);
