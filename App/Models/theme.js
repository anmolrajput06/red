const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const themeSchema = new Schema({
	name : { 
    	type: 'string',
    	required: true
    },
    theme_bg : { 
        type: 'string',
    	default : ''
    },
    theme_icon : {
        type : 'string',
        default: ''
    },
    reel_bg : { 
        type: 'string',
        default : ''
    },
    reel_frame : { 
        type: 'string',
        default : ''
    },
    updatedAt : { type: Date, default: Date.now() },
    createdAt : { type: Date, default: Date.now() }
},{ collection: 'theme', versionKey: false });

mongoose.model('theme', themeSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});