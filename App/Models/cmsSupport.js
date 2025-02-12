const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cmsSupportSchema = new Schema({
    firstName: {
        type: 'string',
        required: true
    },
    lastName: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true
    },
    phoneNumber: {
        type: 'number',
        required: true
    },
    message: {
        type: 'string',
        required: true
    },
}, { collection: 'cmsSupport', versionKey: false });

mongoose.model('cmsSupport', cmsSupportSchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});