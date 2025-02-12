const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommissionRangeSchema = new Schema({
    minimum: {
        type: 'number',
        required: true
    },
    maximum: {
        type: 'number',
        required: true
    },
    role: {
        type: 'string',
        required: true
    },
}, {
    collection: 'commissionrange',
    versionKey: false
});

mongoose.model('commissionRange', CommissionRangeSchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});