const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommissionHistorySchema = new Schema({
    name: {
        type: 'string',
    },
    role: {
        type: 'string',
    },
    commission: {
        type: 'number',
    },
    price:{
        type:'number'
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    createdBy:{
        type:'string'
    },
    transactionId:{
        type:'string'
    },
    transactionType:{
        type:'string'
    },
    updatedAt : { type: Date, default: Date.now },
      createdAt : { type: Date, default: Date.now }
}, {
    collection: 'commissionHistory',
    versionKey: false
});

mongoose.model('commissionHistory', CommissionHistorySchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});