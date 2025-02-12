  'use strict';

  const mongoose = require('mongoose');
  var Sys = require('../../Boot/Sys');
  const gameModel = mongoose.model('game');
  const betModel = mongoose.model('bet');
  const payoutNameModel = mongoose.model('payoutName');
  const symbolNameModel = mongoose.model('symbol');
  const symbolReelModel = mongoose.model('symbolReel');
  const symbolPayoutModel = mongoose.model('symbolPayout');
  const lineModel = mongoose.model('line');


  module.exports = {


      getOneGame: async function(data) {
          try {
              return await gameModel.findOne(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in getOneGame : ' + e);
          }
      },
      getByGame: async function(data) {
          try {
              return await gameModel.find(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in getByGame : ' + e);
          }
      },

      updateGame: async function(condition, data) {
          try {
              await gameModel.update(condition, data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in updateGame : ' + e);
          }
      },

      createGame: async function(data) {
          try {
              await gameModel.create(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in createGame : ' + e);
          }
      },

      getByBet: async function(data) {
          try {
              return await betModel.find(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in getByBet : ' + e);
          }
      },
      getByOneBet: async function(data) {
          try {
              return await betModel.findOne(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in getByOneBet : ' + e);
          }
      },
      updateBet: async function(condition, data) {
          try {
              await betModel.update(condition, data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in updateBet : ' + e);
          }
      },
      deleteBet: async function(data) {
          try {
              await betModel.deleteOne({ _id: data });
          } catch (e) {
              Sys.Log.info('Slotgame service error in deleteBet : ' + e);
          }
      },
      createBet: async function(data) {
          try {
              await betModel.create(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in createBet : ' + e);
          }
      },
      getByPayout: async function(data) {
          try {
              return await payoutNameModel.find(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in getByPayout : ' + e);
          }
      },
      getByOnePayout: async function(data) {
          try {
              return await payoutNameModel.findOne(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in getByOnePayout : ' + e);
          }
      },
      updatePayout: async function(condition, data) {
          try {
              await payoutNameModel.updateOne(condition, data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in updatePayout : ' + e);
          }
      },
      deletePayout: async function(data) {
          try {
              await payoutNameModel.deleteOne({ _id: data });
          } catch (e) {
              Sys.Log.info('Slotgame service error in deletePayout : ' + e);
          }
      },
      createPayout: async function(data) {
          try {
              await payoutNameModel.create(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in createPayout : ' + e);
          }
      },
      getBySymbol: async function(data) {
          try {
              return await symbolNameModel.find(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in getBySymbol : ' + e);
          }
      },
      getBysymbolReel: async function(data) {
          try {
              return await symbolReelModel.find(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in getBysymbolReel : ' + e);
          }
      },

      getSymbolPayoutModel: async function(data) {
          try {
              return await symbolPayoutModel.find(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in getBySymbolPayoutModel : ' + e);
          }
      },
      getlineModel: async function(data) {
          try {
              return await lineModel.find(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in getlineModel : ' + e);
          }
      },

      getOneline: async function(data) {
          try {
              return await lineModel.findOne(data);
          } catch (e) {
              Sys.Log.info('Slotgame service error in getOneline : ' + e);
          }
      },

      getGameDatatable: async function(query, length, start) {
          try {
              return await gameModel.find(query).skip(start).limit(length);
          } catch (e) {
              console.log("Error", e);
          }
      },


  }