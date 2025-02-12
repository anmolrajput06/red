const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SettingSchema = new Schema({
   chips:{
    type:'number',
    default:0
   }
}, { collection: 'setting', versionKey: false });
mongoose.model('setting', SettingSchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});