const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TimerSchema = new Schema({
  	status : {
      type : 'string',
      required : true,
      default : 1
    },
    
    time : {
      type : 'number',
      required : true,
    },
    
    chips : {
      type : 'number',
      required : true,
    },
    updatedAt : { type: Date, default: Date.now },
    createdAt : { type: Date, default: Date.now }
},{ collection: 'timeBasedOffer', versionKey: false });

mongoose.model('timeBasedOffer', TimerSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});