const { boolean } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chipsSchema = new Schema({
    player: {
        type: Schema.Types.ObjectId,
        ref: 'player',
        required: true
    },
    gamePlayer: {
        type: Schema.Types.ObjectId,
        ref: 'gamePlayer',
        required: true
    },
    quantity: {
        type: 'number',
        required: true
    },
    bet: {
        type: 'number',
        defualt: 0
    },
    remaining: {
        type: 'number',
        required: true
    },
    remark: {
        type: 'string',
        // required : true
    },
    type: {
        type: 'string',
        required: true // bet/win = slot, commission/pokerbet/pokerwin/pokerjackpotbuy/pokerjackpotwin/pokerjackpotadd(added by admin) = poker, transferdebit/transfercredit = transfer, giftbought = gift bought, recharge = in-app chips purchase
    },
    line: {
        type: Schema.Types.ObjectId,
        ref: 'line',
        allowNull: true
    },
    /* spin : {
			type : 'number',
			default:0
		  }, */
    spin: {
        type: Schema.Types.Mixed,
        default: 0
    },
    isDeleted:{
        type: 'boolean',
default:0
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'chipstransaction', versionKey: false });

mongoose.model('chipsTransaction', chipsSchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});