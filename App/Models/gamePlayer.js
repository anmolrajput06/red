const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const gamePlayerSchema = new Schema({
    game: {
        type: Schema.Types.ObjectId,
        ref: 'game'
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: 'player'
    },
    theme: {
        type: 'string',
        required: true
    },
    status: {
        type: 'string',
        required: true,
    },
    room: {
        type: 'number',
        required: true,
        default: 1
    },
    chipsTransactions: {
        type: Schema.Types.ObjectId,
        ref: 'chipsTransaction',
        via: 'player'
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'gamePlayer', versionKey: false });

mongoose.model('gamePlayer', gamePlayerSchema);

mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});