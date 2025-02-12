'use strict';
var Sys = require('../../../Boot/Sys');
const mongoose = require('mongoose');
const giftsModel  = mongoose.model('gifts');
const giftPlayertModel  = mongoose.model('giftPlayer');


module.exports = { 
    update: async function(condition, data){
        try {
          await giftsModel.update(condition, data);
        } catch (e) {
          Sys.Log.info('Gift service Error in update : ' + e);
        }
    },
    getByPlayerID: async function(data){
        console.log('Find By Data:',data)
        try {
			return  await giftsModel.findOne(data);
        } catch (e) {
            Sys.Log.info('Gift service Error in getByPlayerID : ' + e);
        }
    },

    create: async function(data) 	{
        try{
            return  await giftsModel.create(data);
        }catch (e){
            Sys.Log.info('Gift service Error in create : ' + e);
        }
    },
    
    getByGift: async function(data){
         
        try {
            return  await giftsModel.find(data).sort( { chips: -1 } );
        } catch (error) {
            Sys.Log.info('Gift service Error in getByGift ' + e);
        }
    },
    getByOneGift: async function(data){
         
        try {
            return  await giftsModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Gift service Error in getByOneGift ' + e);
        }
    },
    createGiftPlayer: async function(data)    {
        try{
            return  await giftPlayertModel.create(data);
        }catch (e){
            Sys.Log.info('Gift service Error in createGiftPlayer : ' + e);
        }
    },

    getByGiftPlayer: async function(data){
        try {
            return  await giftPlayertModel.find(data).sort('updatedAt DESC').populate('gifts');
        } catch (e) {
            Sys.Log.info('Gift service Error in getByGiftPlayer : ' + e);
        }
    },

    getByOneGiftPlayer: async function(data){
        try {
            return  await giftPlayertModel.findOne(data).populate('gifts');
        } catch (e) {
            Sys.Log.info('Gift service Error in getByGiftPlayer : ' + e);
        }
    },

    gitPlayerUpdate: async function(condition, data){
        try {
          await giftsModel.update(condition, data);
        } catch (e) {
          Sys.Log.info('Gift service Error in gitPlayerUpdate : ' + e);
        }
    },
}
 
 
