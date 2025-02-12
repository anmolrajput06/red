'use strict';
var Sys = require('../../../Boot/Sys');
const mongoose = require('mongoose');
const lineModel = mongoose.model('line');
const reelModel = mongoose.model('reel');
const rowModel = mongoose.model('row');
const symbolModel = mongoose.model('symbol');
const betModel = mongoose.model('bet');
const symbolPayoutModel = mongoose.model('symbolPayout');
const timeBasedOfferModel = mongoose.model('timeBasedOffer');
module.exports = {

    getByLine: async function(query, limit) {
        try {
            return await lineModel.find(query).limit(limit);
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in getByLine : ' + e);
        }
    },
    getByLineLimit_extra: async function(data, query) {
        try {
            return await lineModel.find(data).limit(query);
        } catch (e) {
            Sys.Log.info('Slotgame Service Error in getByLineLimit_extra : ' + e);
        }
    },
    getByLineLimit: async function(data, query) {
        try {
            return await lineModel.find(data).limit(query);
        } catch (e) {
            Sys.Log.info('Slotgame Service Error in getByLineLimit : ', e);
        }
    },
    getByreel: async function(data) {
        try {
            return await reelModel.find(data).populate('game');
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in getByreel : ' + e);
        }
    },
    getReelsData: async function(data) {
        try {
            return await reelModel.find(data);
        } catch (e) {
            console.log('Slotgame Servcie Error in getReelsData : ', e);
            return new Error(e);
        }
    },
    getByrow: async function(data) {
        try {
            return await rowModel.find(data).populate('game');
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in getByreel : ' + e);
        }
    },
    getRowsData: async function(data) {
        try {
            return await rowModel.find(data);
        } catch (e) {
            console.log('Slotgame Servcie Error in getRowsData : ', e);
            return new Error(e);
        }
    },

    update: async function(condition, data) {
        try {
            await lineModel.update(condition, data);
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in update : ' + e);
        }
    },
    getByOneData: async function(data) {
        try {
            return await lineModel.findOne(data);
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in getByOneData : ' + e);
        }
    },

    create: async function(data) {
        try {
            return await lineModel.create(data);
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in create : ' + e);
        }
    },

    getSymbol: async function(data) {
        try {
            return await symbolModel.find(data);
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in getSymbol : ' + e);
        }
    },
    getThemeSymbol: async function(data) {
        try {
            return await symbolModel.find(data).populate('symbol').populate('theme');
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in getThemeSymbol : ' + e);
        }
    },
    getBySymbolPayout: async function(data) {
        try {
            return await symbolPayoutModel.find(data);
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in getBySymbol : ' + e);
        }
    },
    getOneSymbol: async function(data) {
        try {
            return await symbolModel.findOne(data);
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in getOneSymbol : ' + e);
        }
    },
    getBet: async function(data) {
        try {
            return await betModel.find(data);
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in getBet : ' + e);
        }
    },
    getBetOne: async function(data) {
        try {
            return await betModel.findOne(data);
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in getBetOne : ' + e);
        }
    },
    getOneTimeOffer: async function(data) {
        try {
            return await timeBasedOfferModel.find(data);
        } catch (e) {
            Sys.Log.info('Slotgame Servcie Error in getOneTimeOffer : ' + e);
        }
    },
}