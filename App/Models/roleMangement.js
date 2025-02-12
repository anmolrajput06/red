const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roleSchema = new Schema({
    name: { type: 'string' },
    permission: { type: 'object' },
    role:{type:'string'},
    is_deleted: { type: 'string', default: "0" },
}, { collection: 'roleManagement', versionKey: false });

mongoose.model('roleManagement', roleSchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});