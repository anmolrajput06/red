const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const symbolReelSchema = new Schema({
	count:{
	  type:'number'
	},
  reel:{
    type: Schema.Types.ObjectId,
	  ref: 'reel'
  },
  symbol: {
    type: Schema.Types.ObjectId,
	  ref: 'symbol'
  },
  game: {
    type: Schema.Types.ObjectId,
	  ref: 'Game'
  },
},{ collection: 'symbolreel', versionKey: false });

mongoose.model('symbolReel', symbolReelSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});