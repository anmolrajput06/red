const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WithdrawRequestSchema = new Schema({
    playerId: {
        type: Schema.Types.ObjectId,
        ref: 'player'
    },
    username: {
        type: 'string'
    },
    chips: {
        type: 'number'
    },
    afterBalance: {
        type: 'number'
    },
    withdrawAmount: {
        type: 'number'
    },
    transactionId:{
        type: 'string'
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
    // first_name : {
    // 	type : 'string',
    // 	default : ''
    // },
    // last_name : {
    // 	type : 'string',
    // 	default : ''
    // },
    // birth_date : {
    // 	type : Date,
    // 	default : ''
    // },
    // pincode : {
    // 	type : 'number',
    // 	default : ''
    // },
    // dist : {
    // 	type : 'string',
    // 	default : ''
    // },
    // state : {
    // 	type : 'string',
    // 	default : ''
    // },
    // mobile : {
    // 	type : 'string',
    // 	default : ''
    // },

}, { collection: 'withdrawRequestHistory', versionKey: false });

mongoose.model('withdrawRequestHistory', WithdrawRequestSchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});