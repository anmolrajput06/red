'use strict';
var Sys = require('../../../Boot/Sys');

const mongoose = require('mongoose');
const symbolPayoutModel  = mongoose.model('symbolPayout');

module.exports = { 
 
    getOneSymbolPayout: async function(data){
        try {
			return  await symbolPayoutModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Reel Service Error in getOneSymbolPayout : ' + error);
        }
    },
    getBySymbolPayout: async function(data){
        try {
			return  await symbolPayoutModel.find(data);
        } catch (error) {
            Sys.Log.info('Reel Service Error in getBySymbolPayout : ' + error);
        }
    },

    getFindSymbolPayout: async function(data){
        try {
			return  await symbolPayoutModel.find(data).populate('game');
        } catch (error) {
            Sys.Log.info('Reel Service Error in getFindSymbolPayout : ' + error);
        }
    },

    symbolPayoutCreate: async function(data){
        try {
            return  await symbolPayoutModel.create(data);
        } catch (error) {
            Sys.Log.info('symbolpayout service Error in symbolPayoutCreate : ' + error);
        }

    },
}
 
 
