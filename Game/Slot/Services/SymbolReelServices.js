'use strict';
var Sys = require('../../../Boot/Sys');
const mongoose = require('mongoose');
const symbolReelModel = mongoose.model('symbolReel');
const symbolPayoutModel = mongoose.model('symbolPayout');
const payoutNameModel = mongoose.model('payoutName');

module.exports = {

    create: async function(data) {
        try {
            return await symbolReelModel.create(data);
        } catch (error) {
            Sys.Log.info('symbolReel service Error in create player : ' + error);
        }

    },
    getOneByData: async function(data) {
        try {
            return await symbolReelModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Error in getOneByData : ' + error);
        }
    },
    getBySymbolReels: async function(data) {
        try {
            console.log(data)
            return await symbolReelModel.find(data);
            // return  await symbolReelModel.find(data).populate('symbol').sort('reel ASC');
            // return  await symbolReelModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getBySymbolReels : ' + error);
        }
    },

    getById: async function(id) {

        try {
            return await symbolReelModel.findById(id);
        } catch (error) {
            Sys.Log.info('Error in getById : ' + error);
        }
    },

    update: async function(condition, data) {
        try {
            await symbolReelModel.update(condition, data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    symbolReelRemove: async function(data) {
        try {
            await symbolReelModel.remove({});
        } catch (e) {
            console.log("Error", e);
        }
    },

    getSymbolPayout: async function(data) {
        try {
            return await symbolPayoutModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getOneByData : ' + error);
        }
    },

    getSymbolPayoutOne: async function(data) {
        try {
            return await symbolPayoutModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Error in getSymbolPayoutOne : ' + error);
        }
    },

    getpayoutName: async function(data) {
        try {
            return await payoutNameModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getOneByData : ' + error);
        }
    },
}