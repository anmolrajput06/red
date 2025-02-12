const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SocketSchema = new Schema({
      playerId : { type: Schema.Types.ObjectId, ref: 'player' },
      socketId : { type: 'string', required: false }
      
},{ collection: 'socket', versionKey: false });

mongoose.model('socket', SocketSchema);
mongoose.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});