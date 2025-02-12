const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const customerSchema = new Schema({
    socialId: {
        type: 'string',
        default: null
    },
    loginType : {
        type: 'string',
        default: "S"
    },//S-Simple,G-Google,F-Facebook
    name: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        default: ""
    },
    password: {
        type: 'string',
        default: ""
    },
    balance: {
        type: 'number',
        default: 0
    },
    status: {
        type: 'string',
        default: 'active'
    },
    socketId:{
        type:"string",
        default:""
    },
    login:{
        type:"boolean",
        default:false
    },
    deviceType:{
        type:"string",
        default:""
    },
    deviceToken:{
        type:"string",
        default:""
    },
    authToken:{
        type:"string",
        default:""
    },
    favouriteGameList:{
        type:"object",
        default:{}
    },
}, {
    collection: 'customer',
    versionKey: false,
    timestamps: true
});

mongoose.model('customer', customerSchema);
