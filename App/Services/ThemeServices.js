'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const themeModel  = mongoose.model('theme');
const symbolImageModel  = mongoose.model('symbolImage');

module.exports = {

	createTheme : async function(data){
        try {
            return  await themeModel.create(data);
        } catch (error) {
            Sys.Log.info('Theme Service Error in createTheme : ' + error);
        }
    },

    getByTheme: async function(data){
        try {
            return  await themeModel.find(data);
        } catch (error) {
            Sys.Log.info('Theme Service Error in getByTheme : ' + error);
        }
    },

    getOneTheme: async function(data){
        try {
            return  await themeModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Theme Service Error in getOneTheme : ' + error);
        }
    },

    updateTheme: async function(condition, data){
        try {
            return  await themeModel.update(condition, data);
        } catch (error) {
            Sys.Log.info('Theme Service Error in updateTheme : ' + error);
        }
    },

    deleteTheme: async function(data){
        try {
            return  await themeModel.deleteOne({_id: data});
        } catch (error) {
            Sys.Log.info('Theme Service Error in deleteTheme : ' + error);
        }
    },

    getThemeTable: async function(query, length, start){
        try {
          return  await themeModel.find(query).skip(start).limit(length);
        } catch (error) {
          console.log("Theme Service  Error getThemeTable",error);
        }
    },

    createSymbolImage : async function(data){
        try {
            return  await symbolImageModel.create(data);
        } catch (error) {
            Sys.Log.info('Theme Service Error in createSymbolImage : ' + error);
        }
    },

    getBySymbolImage: async function(data){
        try {
            return  await symbolImageModel.find(data);
        } catch (error) {
            Sys.Log.info('Theme Service Error in getBySymbolImage : ' + error);
        }
    },

    getSymbolImageTable: async function(query, length, start){
        try {
          return  await symbolImageModel.find(query).skip(start).limit(length).populate('theme');
        } catch (error) {
          console.log("Theme Service Error getSymbolImageTable",error);
        }
    },

    getOneSymbolImage: async function(data){
        try {
            return  await symbolImageModel.findOne(data).populate('theme').populate('symbol');
        } catch (error) {
            Sys.Log.info('Theme Service Error in getOneSymbolImage : ' + error);
        }
    },

    updateSymbolImage: async function(condition, data){
        try {
            return  await symbolImageModel.update(condition, data);
        } catch (error) {
            Sys.Log.info('Theme Service Error in updateSymbolImage : ' + error);
        }
    },
    updateManySymbolImage: async function(condition, data){
            try {
                return  await symbolImageModel.updateMany(condition, data);
            } catch (error) {
                Sys.Log.info('Theme Service Error in updateManySymbolImage : ' + error);
            }
    },

}