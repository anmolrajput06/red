'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const reelModel  = mongoose.model('reel');

module.exports = {

	getByReel: async function(data){
        try {
          return  await reelModel.find(data);
        } catch (e) {
          Sys.Log.info('Reel service Error in getByReel : ' + e);
        }
	},
	getByOneReel: async function(data){
	        try {
	          return  await reelModel.findOne(data);
	        } catch (e) {
	          Sys.Log.info('Reel service Error in getByOneReel : ' + e);
	        }
	},
	updateReel: async function(condition, data){
	        try {
	          await reelModel.update(condition, data);
	        } catch (e) {
	          Sys.Log.info('Reel service Error in updateReel : ' + e);
	        }
	},
	createReel: async function(data){
	        try {
	        return  await reelModel.create(data);
	        } catch (e) {
	          Sys.Log.info('Reel service Error in createReel : ' + e);
	        }
	},

	deleteReel: async function(data){
        try {
          await reelModel.deleteOne({_id: data});
        } catch (e) {
          Sys.Log.info('Error in deleteReel : ' + e);
        }
  	},
}