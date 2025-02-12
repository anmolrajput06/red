'use strict';

const mongoose = require('mongoose');
const pokerRoomModel  = mongoose.model('pokerRoom');


module.exports = { 
     update: async function(condition, data){
        try {
          await pokerRoomModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
    },
    getByPlayerID: async function(data){
        console.log('Find By Data:',data)
        try {
			return  await pokerRoomModel.findOne(data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    create: async function(data) 	{
        try{
            return  await pokerRoomModel.create(data);
        }catch (e){
            console.log("Error",e);
        }
    }
}
 
 
