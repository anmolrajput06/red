'use strict';
var Sys = require('../../../Boot/Sys');
const mongoose = require('mongoose');
const gameModel  = mongoose.model('game');
const gamePlayerModel  = mongoose.model('gamePlayer');
const jackpotModel  = mongoose.model('jackpot');
const symbolModel = mongoose.model('symbol')
const lineModel = mongoose.model('line')
const betModelData = mongoose.model('betModel')
const betReportModel = mongoose.model('betReport')


module.exports = { 

    findGame: async function(data){
        try{
            return  await gameModel.find(data);
        }catch(error){
            Sys.Log.info('Theme Service Error in findSingleGame : ' + error);
        }
    },
    findSymbols: async function(data){
        try{
            return  await symbolModel.find(data);
        }catch(e){
            Sys.Log.info('Theme Service Error in findSymbols : ' + error);
        }
    },
    findLines: async function(data){
        try{
            console.log("GameServices findLines",data);
            return  await lineModel.find(data);
        }catch(e){
            Sys.Log.info('Theme Service Error in findLines : ' + error);
        }
    },
    create: async function(data){
        try {
            return  await gameModel.create(data);
        } catch (error) {
            Sys.Log.info('Error in create player : ' + error);
        }

    },
    getOneByData: async function(data){
        try {
			return  await gameModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Error in getOneByData : ' + error);
        }
	},
	getByData: async function(data){
         
        try {
            return  await gameModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
    },
    getByDataLookup: async function(data){
         
        try {
            return  await gameModel.aggregate(data);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
    },

    update: async function(condition, data){
        try {
          await gameModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
    },
    createGamePlayer: async function(data){
        try {
            return  await gamePlayerModel.create(data);
        } catch (error) {
            Sys.Log.info('Error in create player : ' + error);
        }

    },
    getOneByDataGamePlayer: async function(data){
        try {
            return  await gamePlayerModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Error in getOneByData : ' + error);
        }
    },
    updateGamePlayer: async function(condition, data){
        try {
            return  await gamePlayerModel.update(condition, data);
        } catch (error) {
            Sys.Log.info('Error in getOneByData : ' + error);
        }
    },

    getGamePlayerDistance: async function(data){
        try {
            return  await gamePlayerModel.find(data).distinct('room');
        } catch (error) {
            Sys.Log.info('Error in getOneByData : ' + error);
        }
    },
    getByDataJackPot: async function(data){
        try {
            return  await jackpotModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
    },

    getByDataGamePlayer: async function(data){
        try {
            return  await gamePlayerModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
    },

    updateGamePlayer: async function(data){
        try {
              await gamePlayerModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
    },

    findBets: async function(data){
        try {
            console.log("findbets",data);
           return await betModelData.find(data);
      } catch (error) {
          Sys.Log.info('Error in getByData : ' + error);
      }
    },

    createBetReport: async function(data){
        try {
            console.log("createBetReport",data);
           return await betReportModel.create(data);
      } catch (error) {
          Sys.Log.info('Error in getByData : ' + error);
      }
    }

}
 
 
