'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const gameModel = mongoose.model('game');
const symbolModel = mongoose.model('symbol')



module.exports = {
    createGame : async function(data){
        try {
            return  await gameModel.create(data);
        } catch (error) {
            Sys.Log.info('Theme Service Error in createGame : ' + error);
        }
    },
    findSymbols : async function(data){
        try{
            console.log("findSymbols data",data);
            return  await symbolModel.find(data);
        }catch(error){
            Sys.Log.info('Theme Service Error in findSymbols : ' + error);
        }
    },
    findSingleGame: async function(data){
        try{
            return  await gameModel.findOne(data);
        }catch(error){
            Sys.Log.info('Theme Service Error in findSingleGame : ' + error);
        }
    },
    findGame: async function(data){
        try{
            return  await gameModel.find(data);
        }catch(error){
            Sys.Log.info('Theme Service Error in findSingleGame : ' + error);
        }
    },
    createSymbol: async function(data){
        try{
            return  await symbolModel.create(data);
        }catch(error){
            Sys.Log.info('Theme Service Error in createSymbol : ' + error);
        }
    },
    getGame: async function(query, length, start){
        try{
            return  await gameModel.find(query).skip(start).limit(length).lean();
        }catch(error){
            Sys.Log.info('Theme Service Error in getThemeTable : ' + error);
        }
    },
    getGameCount: async function(query){
        try{
            return  await gameModel.countDocuments(query);
        }catch(error){
            Sys.Log.info('Theme Service Error in getGameCount : ' + error);
        }
    },
    countSymbols: async function(query){
        try{
            return  await symbolModel.countDocuments(query);
        }catch(error){
            Sys.Log.info('Theme Service Error in countSymbols : ' + error);
        }
    },
    findSingleSymbol: async function(query){
        try{
            return  await symbolModel.findOne(query);
        }catch(error){
            Sys.Log.info('Theme Service Error in countSymbols : ' + error);
        }
    },
    updateSymbol: async function(condition,data){
        try{
            return  await symbolModel.updateOne(condition,data);
        }catch(error){
            Sys.Log.info('Theme Service Error in findSingleSymbol : ' + error);
        }
    },
    deleteGame: async function(query){
        try {
            return await gameModel.deleteOne(query)
        }catch(error){

            Sys.Log.info('Theme Service Error in deleteGame : ' + error);
        }
    },
    deleteSymbol: async function(query){
        try {
            return await symbolModel.deleteMany(query)
        }catch(error){

            Sys.Log.info('Theme Service Error in deleteSymbol : ' + error);
        }
    },
    findSymbol: async function(query){
        try {
            return await symbolModel.find(query)
        }catch(error){

            Sys.Log.info('Theme Service Error in deleteSymbol : ' + error);
        }
    },
    updateGame: async function(condition,data){
        try {
            return await gameModel.updateOne(condition,data)
        }catch(error){

            Sys.Log.info('Theme Service Error in updateGame : ' + error);
        } 
    }

}