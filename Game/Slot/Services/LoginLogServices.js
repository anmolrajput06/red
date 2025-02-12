'use strict';

const mongoose = require('mongoose');
const loginlogModel  = mongoose.model('loginLog');
const dayBaseDofferModel  = mongoose.model('dayBaseDoffer');



module.exports = { 

    getByData: async function(data){
         
        try {
            return  await loginlogModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
    },

    getByDataBaseOffer: async function(data){
         
        try {
            return  await dayBaseDofferModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
    },

     update: async function(condition, data){
        try {
          await loginlogModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
    },
    getByPlayerID: async function(data){
        console.log('Find By Data:',data)
        try {
			return  await loginlogModel.findOne(data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    create: async function(data)    {
        try{
            return  await loginlogModel.create(data);
        }catch (e){
            console.log("Error",e);
        }
    },

    createDay: async function(data) 	{
        try{
            return  await dayBaseDofferModel.create(data);
        }catch (e){
            console.log("Error",e);
        }
    }
}
 
 
