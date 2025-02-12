'use strict';
var Sys = require('../../../Boot/Sys');
const mongoose = require('mongoose');
const settingModel = mongoose.model('setting');
const selfReport = mongoose.model('selfReport');
module.exports = { 

	findOne: async function(columns){
    try {
      return await settingModel.findOne({}, columns);
    } catch (e) {
      console.log('Catched Error in SetttingServices.findOne :', e);
      return new Error(e);
    }
  },

  update: async function(condition, data){
    try {
      await settingModel.update(condition, data);
    } catch (e) {
      console.log('Catched Error in SetttingServices.update :', e);
      return new Error(e);
    }
  },
createSelfRport: async function(data){
  try {
    await selfReport.create(data);
  } catch (e) {
    console.log('Catched Error in SetttingServices.update :', e);
    return new Error(e);
  }
}
}
