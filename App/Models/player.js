const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PlayerSchema = new Schema({
    // game_players: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'gamePlayer',
    //     via: 'player'
    // },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    device_id: {
        type: 'string',
    },
    referralCode: {
        type: 'string',
    },
    // loginCode: {
    //     type: 'number'
    // },
    // socket_id: {
    //     type: 'string'
    // },
    chips: {
        type: 'number',
        default: 1000
    },
    // level: {
    //     type: 'number',
    //     default: 1
    // },
    // xp: {
    //     type: 'number',
    //     default: 10
    // },
    // day_count: {
    //     type: 'number',
    //     default: 0
    // },
    // loginCode: {
    //     type: 'number',
    //     default: 0
    // },
    status: {
        type: 'string',
        default: 'active'
    },
    username: {
        type: 'string',
    },
    // lastname: {
    //     type: 'string',
    //     default: ''
    // },
    // mobile: {
    //     type: 'string',
    //     default: ''
    // },
    email: {
        type: 'string',
        default: ''
    },
    password: {
        type: 'string',
        default: ''
    },
    // address: {
    //     type: 'string',
    //     default: ''
    // },
    // country: {
    //     type: 'string',
    //     default: ''
    // },
    // city: {
    //     type: 'string',
    //     default: ''
    // },
    // state: {
    //     type: 'string',
    //     default: ''
    // },
    // zip_code: {
    //     type: 'string',
    //     default: ''
    // },

    // date_of_birth: {
    //     type: 'date',
    //     default: ''
    // },
    avatar: {
        type: 'number',
        default: 0
    },
    // fb_avatar: {
    //     type: 'string',
    //     default: ''
    // },
    // device_name: {
    //     type: 'string'
    // },
    device_os: {
        type: 'string'
    },
    // fcm_token: {
    //     type: 'string'
    // },

    // statistics: {
    //     type: 'array',
    //     default: null
    // },

    // botdata: {
    //     type: 'array',
    //     default: null
    // },
    deleted: {
        type: 'boolean',
        default: false
    },
    appVersion: {
        type: 'number',
    },
    isGuestPlayer: {
        type: 'boolean',
        default: false
    },
    playerChips:{
        type: 'number',
        default: 0
    },
    // relations
    // transactions: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'transaction',
    //     via: 'player'
    // },

    // loginLogs: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'loginLog',
    //     via: 'player'
    // },
    // // coming from user table end
    // //relations
    // chipsTransactions: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'chipsTransaction',
    //     via: 'player'
    // },
    // //relations
    // giftPlayers: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'giftPlayer',
    //     via: 'player'
    // },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'player', versionKey: false });
mongoose.model('player', PlayerSchema);
mongoose.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});