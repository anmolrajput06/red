const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cmsSchema = new Schema({
    identifier: {
        type: 'string',
        required: true
    },
    content: {
        type: 'string',
        required: true
    },
    status: {
        type: 'string',
        required: true
    }
}, { collection: 'cms', versionKey: false });

mongoose.model('cms', cmsSchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});