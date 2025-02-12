'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const levelModel  = mongoose.model('level');

module.exports = {

	 getByLevel: async function(data){
        try {
            return  await levelModel.find(data);
        } catch (error) {
            Sys.Log.info('Level Service Error in getByLevel : ' + error);
        }
    },

    getOneLevel: async function(data){
        try {
            return  await levelModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Level Service Error in getOneLevel : ' + error);
        }
    },

    createLevel: async function(data){
        try {
            return  await levelModel.create(data);
        } catch (error) {
            Sys.Log.info('Level Service Error in createLevel : ' + error);
        }
    },

    updateLevel: async function(condition, data){
        try {
            return  await levelModel.update(condition, data);
        } catch (error) {
            Sys.Log.info('Theme Service Error in updateLevel : ' + error);
        }
    },

    deleteLevel: async function(data){
        try {
            return  await levelModel.deleteOne({_id: data});
        } catch (error) {
            Sys.Log.info('Theme Service Error in deleteLevel : ' + error);
        }
    },

}