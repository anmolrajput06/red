'use strict';
var Sys = require('../../../Boot/Sys');

const mongoose = require('mongoose');
const betModel  = mongoose.model('bet');

module.exports = { 
 
    getOneBet: async function(data){
        try {
			return  await betModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Reel Service Error in getOneBet : ' + error);
        }
    },
    getByBet: async function(data){
        try {
			return  await betModel.find(data);
        } catch (error) {
            Sys.Log.info('Reel Service Error in getByBet : ' + error);
        }
    },
}
 
 
