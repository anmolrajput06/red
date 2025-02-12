const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const allUsersTransactionHistorySchema = new Schema({
    player: { type: Schema.Types.ObjectId, ref: 'player' },
    receiverId: { type: Schema.Types.ObjectId, default: null },
    receiverRole: { type: String, default: '' },
    providerId: { type: Schema.Types.ObjectId, default: null },
    providerRole: { type: String, default: '' },
    providerEmail: { type: String, default: '' },
    chips: { type: Number, default: null },
    cash: { type: String, default: '' },
    message: { type: String, default: '' },
    transactionNumber: { type: String, default: '' },
    beforeBalance: { type: Number, default: null },
    afterBalance: { type: Number, default: null },
    type: { type: String, default: '' }, // deposit, withdraw
    status: { type: String, default: '' }, // success, inProgress, cancel
    game: { type: String },
    default: '',
    rackFromId: { type: Schema.Types.ObjectId, default: null },
    rackToId: { type: Schema.Types.ObjectId, default: null },
    rackFrom: { type: String, default: '' },
    rackTo: { type: String, default: '' },
    won: { type: Number, default: null },
    rackPercent: { type: String, default: '' },
    totalRack: { type: Number, default: 0 },
    gameNumber: { type: String, default: '' },
    rackToAfter_balance: { type: Number, default: null },
    rackToBefore_balance: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    sessionId: { type: String, default: '' },
    user_id: { type: String, default: '' },
    username: { type: String, default: '' },
    gameId: { type: Schema.Types.ObjectId, default: null }, //in case of deposit/won on game
    bet_amount: { type: Number, default: 0 },
    previousBalance: { type: Number, default: 0 },
    category: { type: String, default: '' }, //debit/credit
    remark: { type: String, default: '' }, //deposit/won on game <game_id>, deposit/withdraw coins
    isTournament: { type: String, default: '' },
    receiverName: { type: String, default: '' },
    rakeChips: { type: String },
    adminChips: { type: String },
    jackpotChips: { type: String },
    uniqId: { type: String, default: '' },
    chipNote: { type: String }
}, { collection: 'allUsersTransactionHistory', versionKey: false });

mongoose.model('allUsersTransactionHistory', allUsersTransactionHistorySchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});