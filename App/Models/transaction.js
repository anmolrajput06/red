// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const transactionSchema = new Schema({
// 	type : {
//   		type : 'string',
//   		required: true,
//   		default: 'app purchase'  // transfer credit, transfer debit
//   	},
//     player: { 
//     	type : Schema.Types.ObjectId,
// 		ref : 'Player',
//       	required: true 
//     },
//     name: {
//   		type: 'string',
//   	},
//   	txnid: {
//   		type: 'string',
//   		required : true,
//   	},
//   	amount: {
//   		type: 'string',
//   	},
//   	chips: {
//   		type: 'string',
//   		required : true
//   	},
//   	status: {
//   		type: 'string',
//   		required: true
//   	},
//   	createdAt  : { 
//         type : Date, 
//         default : Date.now 
//     }
// },{ collection: 'bet', versionKey: false });

// mongoose.model('transaction', transactionSchema);
// mongoose.set('toJSON', {
//      transform: function (doc, ret, options) {
//          ret.id = ret._id;
//          delete ret._id;
//          delete ret.__v;
//      }
// });