const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TransactionsSchema = new Schema({
      customerId : {
        type : Schema.Types.ObjectId,
      },
      userIdObject: {
        type: "object",
        default: {},
      },
      description: { 
        type : 'string',
		    default : ''
      },
      transaction_chips: {
        type : 'number',
		    default : 0
      },
      transaction_amount: {
        type : 'number',
		    default : 0
      },
      comps_amount:{
        type : 'number',
		    default : 0
      },
      transaction_type:{
      	type : 'string',
		    default : ''
      },
      createdAt  : { 
        type : 'string', 
        default : Date.now() 
      }
},{ collection: 'transaction', versionKey: false });

mongoose.model('transaction', TransactionsSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});