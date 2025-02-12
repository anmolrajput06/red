'use strict';

const mongoose = require('mongoose');
const chisTraModel  = mongoose.model('chipsTransaction');



module.exports = { 

    getByData: async function(data){
         
        try {
            return  await chisTraModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
    },


    update: async function(condition, data){
        try {
          await chisTraModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
    },

    getByPlayerID: async function(data){
        console.log('Find By Data:',data)
        try {
			return  await chisTraModel.findOne(data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    create: async function(data)    {
        try{
            return  await chisTraModel.create(data);
        }catch (e){
            console.log("Error",e);
        }
    },

}
 
 
