const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SelfRportSchema = new Schema({
    totalInward: {
        type: 'number',
    },
    totalOutward: {
        type: 'number',
    },
    totalChipsIncome: {
        type: 'number',
    },
    desiredChipsIncome:{
        type:'number'
    },
    transactionId:{
        type:'string'
    },
    updatedAt : { type: Date, default: Date.now },
    createdAt : { type: Date, default: Date.now }
}, {
    collection: 'selfReport',
    versionKey: false
});

mongoose.model('selfReport', SelfRportSchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});