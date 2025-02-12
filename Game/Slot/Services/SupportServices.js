'use strict';
var Sys = require('../../../Boot/Sys');

const mongoose = require('mongoose');
const supportModel  = mongoose.model('support');
const supportReplayModel  = mongoose.model('supportReplay');

module.exports = { 
 
    getOneSupportModel: async function(data){
        try {
			return  await supportModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Reel Service Error in getOneSupportModel : ' + error);
        }
    },
    getOneSupport: async function(data){
        try {
			return  await supportModel.findOne(data).populate('supportReply');
        } catch (error) {
            Sys.Log.info('Reel Service Error in getOneSupport : ' + error);
        }
    },
    getUpdateSupport: async function(condition, data){
        try {
			return  await supportModel.update(condition, data);
        } catch (error) {
            Sys.Log.info('Reel Service Error in getUpdateSupport : ' + error);
        }
    },
    SupportCreate: async function(data){
        try {
			return  await supportModel.create(data);
        } catch (error) {
            Sys.Log.info('Reel Service Error in SupportCreate : ' + error);
        }
    },
    getBySupportModel: async function(data){
        try {
			return  await supportModel.find(data).populate('player');
        } catch (error) {
            Sys.Log.info('Reel Service Error in getBySupportModel : ' + error);
        }
    },

    getBySupportReplay: async function(data){
        try {
			return  await supportReplayModel.find(data);
        } catch (error) {
            Sys.Log.info('Reel Service Error in getBySupportReplay : ' + error);
        }
    },

    supportReplayCreate: async function(data){
        try {
			return  await supportReplayModel.create(data);
        } catch (error) {
            Sys.Log.info('Reel Service Error in supportReplayCreate : ' + error);
        }
    },
}
 
 
