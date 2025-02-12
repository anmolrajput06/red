'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const rowModel  = mongoose.model('row');

module.exports = {

	getByRow: async function(data){
        try {
          return  await rowModel.find(data);
        } catch (e) {
          Sys.Log.info('Row Services Error in getByRow : ' + e);
        }
	},
	getByOneRow: async function(data){
	        try {
	          return  await rowModel.findOne(data);
	        } catch (e) {
	          Sys.Log.info('Row Services Error in getByOneRow : ' + e);
	        }
	},
	updateRow: async function(condition, data){
	        try {
	          await rowModel.update(condition, data);
	        } catch (e) {
	          Sys.Log.info('Row Services Error in updateRow : ' + e);
	        }
	},
	deleteRow: async function(data){
	        try {
	          await rowModel.deleteOne({_id: data});
	        } catch (e) {
	          Sys.Log.info('Row Services Error in deleteRow : ' + e);
	        }
	},

	createRow: async function(data){
        try {
        return  await rowModel.create(data);
        } catch (e) {
          Sys.Log.info('Row Services Error in createRow : ' + e);
        }
  	},
}