const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const betSchema = new Schema({
	customerId : {
  		type : 'String',
  		required: true
  	},
    userIdObject: {
        type: 'object',
        default:{}
    },
    gameType:{
        type:'String',
        enum:['slot','keno'],
        default:'slot'
    },
    pointsPlayed: { 
        type : 'number',
        required: true 
    }, 
    lastWin: { 
        type : 'String',
        default: ""
    },
    winLines: { 
        type :'object',
        default: "" 
    },
    customerName:{
        type:'String',
        default:""
    },
    customerEmail:{
        type:'String',
        default:""
    },
    customerUniqueId:{
        type:'String',
        default:""
    },
    betType:{
        type:"String",
        default:"bet"
    },
    createdAt : { type: Date, default: Date.now() },
    updatedAt : { type: Date, default: Date.now() }
},{ collection: 'betReport', versionKey: false });

mongoose.model('betReport', betSchema);
