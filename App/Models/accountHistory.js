const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AccountSchema = new Schema({
      playerId: {
        type: 'string',
        default: ''
      },
      deposite: {
        type : 'number',
		    default : 0
      },
      withdrawable: {
        type : 'number',
		    default : 0
      },
      cash: {
        type : 'number',
		    default : 0
      },
      clubStatus: {
        type: 'string',
        default: 'active'
      },
      loyaltyPoints: {
        type : 'number',
		    default : 0
      },
      pendingBonus : {
        type : 'number',
		    default : 0
      },
      releasedBonus : {
        type : 'number',
		    default : 0
      },
      clubStatusValidTill: {
        type: 'string',
        default: 'active'
      },
      createdAt  : { 
        type : Date, 
        default : Date.now 
      }
},{ collection: 'account', versionKey: false });

mongoose.model('account', AccountSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});