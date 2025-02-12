'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const lineModel  = mongoose.model('line');


module.exports = {

	getOneLine: async function(data){
        try {
          return  await lineModel.findOne(data);
        } catch (e) {
          Sys.Log.info('Line service Error in getOneLine : ' + e);
        }
    },
	getByLine: async function(data){
        try {
          return  await lineModel.find(data);
        } catch (e) {
          Sys.Log.info('Line service Error in getByLine : ' + e);
        }
	},

	createLine: async function(data){
        try {
          return  await lineModel.create(data);
        } catch (e) {
          Sys.Log.info('Line service Error in createLine : ' + e);
        }
  },

  updateLine: async function(condition,data){
          try {
            return  await lineModel.updateOne(condition,data);
          } catch (e) {
            Sys.Log.info('Line service Error in updateLine : ' + e);
          }
  },
  deleteLine: async function(data){
        try {
          await lineModel.deleteOne({_id: data});
        } catch (e) {
          Sys.Log.info('Line service Error in deleteLine : ' + e);
        }
    },

}