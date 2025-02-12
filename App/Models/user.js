const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    userId:{
        type : Schema.Types.ObjectId,
    },
    userIdObject: {
        type: 'object',
        default:{}
    },
    name: {
        type: 'string',
        required: true
    },
    userName:{
        type:'string',
        required:true
    },
    email: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
    status: {
        type: 'string',
        default: 'active'
    },
    role: {
        type: 'string',
        required: true
    },
    gameMode:{
        type:'string',
        required:true
    },
    mobile: {
        type: 'number',
        required: true
    },
    rtpSettings:{
        type:'object'
    },
    bonceBackLimit:{
        type:'string',
       default:"false"
    },
    bounceBack:{
        type:'object'
    },
    image: {
        type: String,
        default: '/dist/img/user123.png'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    uniqueId: {
        type: "string",
        unique: true 
    },
    timeZone :{
        type:"string",
        required:true
    },
    cashOut:{
        type:"string",
        default:"false"
    },
    comunityPrice:{
        type:"number",
        required:true
    },createdUser:{
        type:"number",
        default:0
    },
    city:{
        type:"string",
        default:""
    },
    percentage:{
        type:"string",
        default:""
    },
    cash:{
        type:"number",
        default:0
    },
    updatedAt : { type: Date, default: Date.now() },
    createdAt : { type: Date, default: Date.now() }
}, {
    collection: 'user',
    versionKey: false
});

mongoose.model('user', UserSchema);
