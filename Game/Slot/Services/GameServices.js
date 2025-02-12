'use strict';
var Sys = require('../../../Boot/Sys');
const mongoose = require('mongoose');
const gameModel  = mongoose.model('game');
const playerModel  = mongoose.model('player');
const gamePlayerModel  = mongoose.model('gamePlayer');
const jackpotModel  = mongoose.model('jackpot');
const rowsModel  = mongoose.model('row');
const reelsModel  = mongoose.model('reel');
const roomModel  = mongoose.model('room');
const giftsModel  = mongoose.model('gifts');
const chipsTransactionModel  = mongoose.model('chipsTransaction');
module.exports = { 

    create: async function(data){
        try {
            return  await gameModel.create(data);
        } catch (error) {
            Sys.Log.info('Game service Error in create player : ' + error);
        }

    },
    getOneGame: async function(data){
        try {
			return  await gameModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Game service Error in getOneGame : ' + error);
        }
	},
    getOneGameMultipleModel: async function(data){
        try {
            return  await gameModel.findOne(data).populate('reels').populate('rows');
        } catch (error) {
            Sys.Log.info('Game service Error in getOneGameMultipleModel : ' + error);
        }
    },
    getOnePopulate: async function(data){
        try {
            return  await gameModel.findOne(data).populate('row').populate('reel');
        } catch (error) {
            Sys.Log.info('Game service Error in getOnePopulate : ' + error);
        }
    },
    getGame: async function(data){
        try {
            return  await gameModel.findOne(data).populate('row').populate('reel');
            // return  await gameModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Game service Error in getGame : ' + error);
        }
    },
    getByOneGame: async function(data){
        try {
            let game = await  gameModel.findOne(data);
            let row = await  rowsModel.find({game : game.id});
            let reel =  await reelsModel.find({game : game.id});
          return  game = {
                'game' : game,
                'rows' : row,
                'reels' : reel
            }
        } catch (error) {
            Sys.Log.info('Game service Error in getByOneGame : ' + error);
        }
    },
	getByGame: async function(data){
         
        try {
            return  await gameModel.find(data);
        } catch (error) {
            Sys.Log.info('Game service Error in getByGame : ' + error);
        }
    },

    update: async function(condition, data){
        try {
          await gameModel.update(condition, data);
        } catch (error) {
           Sys.Log.info('Game service Error in update : ' + error);
        }
    },
    createGamePlayer: async function(data){
        try {
            return  await gamePlayerModel.create(data);
        } catch (error) {
            Sys.Log.info('Game service Error in create createGamePlayer : ' + error);
        }

    },
    getOneByDataGamePlayer: async function(data){
        try {
            return  await gamePlayerModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Game service Error in getOneByDataGamePlayer : ' + error);
        }
    },

    getGamePlayer: async function(data){
        try {
            return  await gamePlayerModel.findOne(data).populate('player');
        } catch (error) {
            Sys.Log.info('Game service Error in getGamePlayer : ' + error);
        }
    },

    getGamePlayerDistance: async function(data){
        try {
            return  await gamePlayerModel.find(data).distinct('room');
        } catch (error) {
            Sys.Log.info('Game service Error in getGamePlayerDistance : ' + error);
        }
    },
    getByDataJackPot: async function(data){
        try {
            return  await jackpotModel.find(data);
        } catch (error) {
            Sys.Log.info('Game service Error in getByDataJackPot : ' + error);
        }
    },

    getByDataGamePlayer: async function(data){
        try {
            return  await gamePlayerModel.find(data);
        } catch (error) {
            Sys.Log.info('Game service Error in getByDataGamePlayer : ' + error);
        }
    },

    getGamePlayerJackpot: async function(data){
        try {
            return  await gamePlayerModel.find(data).populate('chipsTransaction');
        } catch (error) {
            Sys.Log.info('Game service Error in getGamePlayerJackpot : ' + error);
        }
    },

    gamePlayerCount: async function(data){
        try {
            return  await gamePlayerModel.find(data).count();
        } catch (error) {
            Sys.Log.info('Game service Error in gamePlayerCount : ' + error);
        }
    },

    updateGamePlayer: async function(condition, data){
        try {
              await gamePlayerModel.update(condition, data);
        } catch (error) {
            Sys.Log.info('Game service Error in updateGamePlayer : ' + error);
        }
    },

    updateGamePlayerReturn: async function(condition, data){
        try {
            return  await gamePlayerModel.update(condition, data);
        } catch (error) {
            Sys.Log.info('Game service Error in updateGamePlayer : ' + error);
        }
    },

    joinQuery: async function(data){
        try {
           return await gamePlayerModel.find(data,{status : 1,_id : 0}).populate('player',{device : 1,username : 1});

        } catch (error) {
            Sys.Log.info('Game service Error in joinQuery : ' + error);
        }
    },
}
 
 
