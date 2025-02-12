'use strict';

const mongoose = require('mongoose');
var Sys = require('../../../Boot/Sys');
const themeModel  = mongoose.model('theme');
const symbolImageModel  = mongoose.model('symbolImage');

module.exports = {

	createTheme : async function(data){
        try {
            return await themeModel.create(data);
        } catch (error) {
            console.log('Theme Service Error in createTheme : ', error);
            return new Error(error);
        }
    },

    getByTheme: async function(data){
        try {
            return await themeModel.find(data);
        } catch (error) {
            console.log('Theme Service Error in getByTheme : ', error);
            return new Error(error);
        }
    },

    getByThemeSelect: async function(data, columns){
        try {
            return await themeModel.find(data).select(columns);
        } catch (error) {
            console.log('Theme Service Error in getByTheme : ', error);
            return new Error(error);
        }
    },

    getOneTheme: async function(data){
        try {
            return await themeModel.findOne(data);
        } catch (error) {
            console.log('Theme Service Error in getOneTheme : ', error);
            return new Error(error);
        }
    },

    updateTheme: async function(condition, data){
        try {
            return await themeModel.update(condition, data);
        } catch (error) {
            console.log('Theme Service Error in updateTheme : ', error);
            return new Error(error);
        }
    },

    deleteTheme: async function(data){
        try {
            return await themeModel.deleteOne({_id: data});
        } catch (error) {
            console.log('Theme Service Error in deleteTheme : ', error);
            return new Error(error);
        }
    },

    getThemeTable: async function(query, length, start){
        try {
          return await themeModel.find(query).skip(start).limit(length);
        } catch (error) {
          console.log("Theme Service  Error getThemeTable",error);
        }
    },

    createSymbolImage : async function(data){
        try {
            return await symbolImageModel.create(data);
        } catch (error) {
            console.log('Theme Service Error in createSymbolImage : ', error);
            return new Error(error);
        }
    },

    getBySymbolImage: async function(data){
        try {
            return await symbolImageModel.find(data);
        } catch (error) {
            console.log('Theme Service Error in getBySymbolImage : ', error);
            return new Error(error);
        }
    },

    getSymbolImageTable: async function(query, length, start){
        try {
          return await symbolImageModel.find(query).skip(start).limit(length).populate('theme');
        } catch (error) {
          console.log("Theme Service Error getSymbolImageTable", error);
          return new Error(error);
        }
    },

    getOneSymbolImage: async function(data){
        try {
            return await symbolImageModel.findOne(data).populate('theme').populate('symbol');
        } catch (error) {
            console.log('Theme Service Error in getOneSymbolImage : ', error);
            return new Error(error);
        }
    },

    updateSymbolImage: async function(condition, data){
        try {
            return await symbolImageModel.update(condition, data);
        } catch (error) {
            console.log('Theme Service Error in updateSymbolImage : ', error);
            return new Error(error);
        }
    },

}