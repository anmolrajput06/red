const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CashierRportSchema = new Schema({
    intialAmount: {
        type: 'number',
    },
    withdrwAmount: {
        type: 'number',
    },
    depositAmount: {
        type: 'number',
    },
    transactionId:{
        type:'string'
    },
    type:{
        type:'string'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    updatedAt : { type: Date, default: Date.now },
    createdAt : { type: Date, default: Date.now }
}, {
    collection: 'cashierReport',
    versionKey: false
});

mongoose.model('cashierReport', CashierRportSchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});