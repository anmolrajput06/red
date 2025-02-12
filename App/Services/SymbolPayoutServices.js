'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const symbolPayoutModel  = mongoose.model('symbolPayout');


module.exports = {

	createPayout: async function(data){
        try {
        	return  await symbolPayoutModel.create(data);
        } catch (e) {
          Sys.Log.info('SymbolPayout Services Error in createPayout : ' + e);
        }
  	},

  	getByPayout: async function(data){
        try {
            return  await symbolPayoutModel.find(data);
        } catch (error) {
            Sys.Log.info('SymbolPayout ServicesError in getByPayout : ' + error);
        }
    },

    getOnePayout: async function(data){
        try {
            return  await symbolPayoutModel.findOne(data);
        } catch (error) {
            Sys.Log.info('SymbolPayout ServicesError in getOnePayout : ' + error);
        }
    },

    deletePayout : async function(data){
        try {
            return  await symbolPayoutModel.deleteOne({_id: data});
        } catch (error) {
            Sys.Log.info('SymbolPayout ServicesError in deletePayout : ' + error);
        }
    },

    updatePayout: async function(condition, data){
        try {
            return  await symbolPayoutModel.update(condition, data);
        } catch (error) {
            Sys.Log.info('SymbolPayout Services Error in updatePayout : ' + error);
        }
    },

}