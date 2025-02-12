'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const symbolReelModel  = mongoose.model('symbolReel');

module.exports = {

	createSymbolReel : async function(data){
        try {
            return  await symbolReelModel.create(data);
        } catch (error) {
            Sys.Log.info('SymbolReel Service Error in createSymbolReel : ' + error);
        }
    },

    getBySymbolReel: async function(data){
        try {
            return  await symbolReelModel.find(data);
        } catch (error) {
            Sys.Log.info('SymbolReel Service Error in getBySymbolReel : ' + error);
        }
    },

    getOneSymbolReel: async function(data){
        try {
            return  await symbolReelModel.findOne(data);
        } catch (error) {
            Sys.Log.info('SymbolReel Service Error in getOneSymbolReel : ' + error);
        }
    },

    deleteSymbolReel : async function(data){
        try {
            return  await symbolReelModel.deleteOne({_id: data});
        } catch (error) {
            Sys.Log.info('SymbolReel Service Error in deleteSymbolReel : ' + error);
        }
    },

    updateSymbolReel: async function(condition, data){
        try {
            return  await symbolReelModel.update(condition, data);
        } catch (error) {
            Sys.Log.info('SymbolReel Service Error in updateSymbolReel : ' + error);
        }
    },

}