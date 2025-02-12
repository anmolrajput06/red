  'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const gameModel  = mongoose.model('game');
const reelModel  = mongoose.model('reel');
const rowModel  = mongoose.model('row');
const betModel  = mongoose.model('bet');
const payoutNameModel  = mongoose.model('payoutName');
const symbolNameModel  = mongoose.model('symbol');
const symbolReelModel  = mongoose.model('symbolReel');
const symbolPayoutModel  = mongoose.model('symbolPayout');
const lineModel  = mongoose.model('line');


module.exports = {


  getOneGame: async function(data){
        try {
          return  await gameModel.findOne(data);
        } catch (e) {
          Sys.Log.info('Error in getOneGame : ' + e);
        }
  },
  getByGame: async function(data){
        try {
          return  await gameModel.find(data);
        } catch (e) {
          Sys.Log.info('Error in getByGame : ' + e);
        }
  },

  updateGame: async function(condition, data){
        try {
          await gameModel.update(condition, data);
        } catch (e) {
          Sys.Log.info('Error in updateGame : ' + e);
        }
  },

  createGame: async function(data){
        try {
          await gameModel.create(data);
        } catch (e) {
          Sys.Log.info('Error in createGame : ' + e);
        }
  },
  getByReel: async function(data){
        try {
          return  await reelModel.find(data);
        } catch (e) {
          Sys.Log.info('Error in getByReel : ' + e);
        }
  },
  getByOneReel: async function(data){
        try {
          return  await reelModel.findOne(data);
        } catch (e) {
          Sys.Log.info('Error in getByOneReel : ' + e);
        }
  },
  updateReel: async function(condition, data){
        try {
          await reelModel.update(condition, data);
        } catch (e) {
          Sys.Log.info('Error in updateReel : ' + e);
        }
  },
  createReel: async function(data){
        try {
        return  await reelModel.create(data);
        } catch (e) {
          Sys.Log.info('Error in createReel : ' + e);
        }
  },
  createRow: async function(data){
        try {
        return  await rowModel.create(data);
        } catch (e) {
          Sys.Log.info('Error in createRow : ' + e);
        }
  },
  deleteReel: async function(data){
        try {
          await reelModel.deleteOne({_id: data});
        } catch (e) {
          Sys.Log.info('Error in deleteReel : ' + e);
        }
  },
  getByRow: async function(data){
        try {
          return  await rowModel.find(data);
        } catch (e) {
          Sys.Log.info('Error in getByRow : ' + e);
        }
  },
  getByOneRow: async function(data){
        try {
          return  await rowModel.findOne(data);
        } catch (e) {
          Sys.Log.info('Error in getByOneRow : ' + e);
        }
  },
  updateRow: async function(condition, data){
        try {
          await rowModel.update(condition, data);
        } catch (e) {
          Sys.Log.info('Error in updateRow : ' + e);
        }
  },
  deleteRow: async function(data){
        try {
          await rowModel.deleteOne({_id: data});
        } catch (e) {
          Sys.Log.info('Error in deleteRow : ' + e);
        }
  },
  getByBet: async function(data){
        try {
          return  await betModel.find(data);
        } catch (e) {
          Sys.Log.info('Error in getByBet : ' + e);
        }
  },
  getByOneBet: async function(data){
        try {
          return  await betModel.findOne(data);
        } catch (e) {
          Sys.Log.info('Error in getByOneBet : ' + e);
        }
  },
  updateBet: async function(condition, data){
        try {
          await betModel.update(condition, data);
        } catch (e) {
          Sys.Log.info('Error in updateBet : ' + e);
        }
  },
  deleteBet: async function(data){
        try {
          await betModel.deleteOne({_id: data});
        } catch (e) {
          Sys.Log.info('Error in deleteBet : ' + e);
        }
  },
  createBet: async function(data){
        try {
          await betModel.create(data);
        } catch (e) {
          Sys.Log.info('Error in createBet : ' + e);
        }
  },
  getByPayout: async function(data){
        try {
          return  await payoutNameModel.find(data);
        } catch (e) {
          Sys.Log.info('Error in getByPayout : ' + e);
        }
  },
  getByOnePayout: async function(data){
        try {
          return  await payoutNameModel.findOne(data);
        } catch (e) {
          Sys.Log.info('Error in getByOnePayout : ' + e);
        }
  },
  updatePayout: async function(condition, data){
        try {
          await payoutNameModel.update(condition, data);
        } catch (e) {
          Sys.Log.info('Error in updatePayout : ' + e);
        }
  },
  deletePayout: async function(data){
        try {
          await payoutNameModel.deleteOne({_id: data});
        } catch (e) {
          Sys.Log.info('Error in deletePayout : ' + e);
        }
  },
  createPayout: async function(data){
        try {
          await payoutNameModel.create(data);
        } catch (e) {
          Sys.Log.info('Error in createPayout : ' + e);
        }
  },
  getBySymbol: async function(data){
        try {
          return  await symbolNameModel.find(data);
        } catch (e) {
          Sys.Log.info('Error in getBySymbol : ' + e);
        }
  },
  getBysymbolReel: async function(data){
        try {
          return  await symbolReelModel.find(data);
        } catch (e) {
          Sys.Log.info('Error in getBysymbolReel : ' + e);
        }
  },

  getSymbolPayoutModel: async function(data){
        try {
          return  await symbolPayoutModel.find(data);
        } catch (e) {
          Sys.Log.info('Error in getBySymbolPayoutModel : ' + e);
        }
  },
  getlineModel: async function(data){
      try {
        return  await lineModel.find(data);
      } catch (e) {
        Sys.Log.info('Error in getlineModel : ' + e);
      }
    },

  getOneline: async function(data){
      try {
        return  await lineModel.findOne(data);
      } catch (e) {
        Sys.Log.info('Error in getOneline : ' + e);
      }
    },

  getGameDatatable: async function(query, length, start){
        try {
          return  await gameModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
  },


}
