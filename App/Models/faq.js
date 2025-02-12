const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const faqSchema = new Schema({
	question : {
  		type : 'string',
  		required: true
  	},
    answer: {
  		type: 'string',
  		required: true
  	},
},{ collection: 'faq', versionKey: false });

mongoose.model('faq', faqSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});