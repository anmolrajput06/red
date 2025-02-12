'use strict';

const mongoose = require('mongoose');
const jackpotModel  = mongoose.model('jackpot');


module.exports = { 
	getByData: async function(data) 	{
        try{
            return  await jackpotModel.find(data);
        }catch (e){
            console.log("Error",e);
        }
    },
    getByDataLimit: async function(data)     {
        try{
            return  await jackpotModel.find(data).limit(1);
        }catch (e){
            console.log("Error",e);
        }
    },
     update: async function(condition, data){
        try {
          await jackpotModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
    },
    getByPlayerID: async function(data){
        console.log('Find By Data:',data)
        try {
			return  await jackpotModel.findOne(data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    create: async function(data) 	{
        try{
            return  await jackpotModel.create(data);
        }catch (e){
            console.log("Error",e);
        }
    }
}
 
 

