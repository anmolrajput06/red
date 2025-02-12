'use strict';
var Sys = require('../../../Boot/Sys');
const mongoose = require('mongoose');
const timeBasedOfferModel  = mongoose.model('timeBasedOffer');
const dayBaseDofferModel  = mongoose.model('dayBaseDoffer');

module.exports = { 
 
    getOneTimeBasedOffer: async function(data){
        try {
            return  await timeBasedOfferModel.findOne(data);
        } catch (error) {
            Sys.Log.info('TimeBasedOffer Service Error in getOneTimeBasedOffer : ' + error);
        }
    },
    getByTimeBasedOffer: async function(data){
        try {
            return  await timeBasedOfferModel.find(data);
        } catch (error) {
            Sys.Log.info('TimeBasedOffer Service Error in getByTimeBasedOffer : ' + error);
        }
    },

	getOneDayBaseDoffer: async function(data){
        try {
            return  await timeBasedOfferModel.findOne(data);
        } catch (error) {
            Sys.Log.info('TimeBasedOffer Service Error in getOneDayBaseDoffer : ' + error);
        }
    },
    getByDayBaseDoffer: async function(data){
        try {
            return  await timeBasedOfferModel.find(data);
        } catch (error) {
            Sys.Log.info('TimeBasedOffer Service Error in getByDayBaseDoffer : ' + error);
        }
    },


}
 
 
