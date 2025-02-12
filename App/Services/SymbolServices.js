'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const symbolModel  = mongoose.model('symbol');

module.exports = {

	getOneSymbol: async function(data){
        try {
            return  await symbolModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Symbol Service Error in getOneSymbol : ' + error);
        }
    },
    getBySymbol: async function(data,theme){
        try {
            var themes = 'image_'+theme
            return  await symbolModel.find(data,{symbol : 1,[themes] : 1,symbol_type : 1,game : 1,_id : 1});
        } catch (error) {
            Sys.Log.info('Symbol Service Error in getBySymbol : ' + error);
        }
    },

    getSymbol: async function(data){
        try {
            return  await symbolModel.find(data);
        } catch (error) {
            Sys.Log.info('Symbol Service Error in getSymbol : ' + error);
        }
    },

    getByThemesSymbol: async function(data,theme){
        try {
            return  await symbolModel.aggregate([{
            	"$project": { 
            		'symbol' : 1,
            		'symbol_type' : 1,
            		'image' :'$image_'+theme
            	}
            },{"$match": data }]);
        } catch (error) {
            Sys.Log.info('Symbol Service Error in getByThemesSymbol : ' + error);
        }
    },

    updateSymbol: async function(condition, data){
        try {
            return  await symbolModel.update(condition, data);
        } catch (error) {
            Sys.Log.info('Symbol Service Error in updateSymbol : ' + error);
        }
    },

    createSymbol: async function(data){
        try {
            return  await symbolModel.create(data);
        } catch (error) {
            Sys.Log.info('Symbol Service Error in createSymbol : ' + error);
        }
    },

    deleteSymbol: async function(data){
        try {
            return  await symbolModel.deleteOne({_id: data});
        } catch (error) {
            Sys.Log.info('Symbol Service Error in deleteSymbol : ' + error);
        }
    },

    getSymbolTable: async function(query, length, start){
        try {
          return  await symbolModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
    	}
 	},
	getSymbolThemeTable: async function(query, length, start,theme){
	        try {
	          return  await symbolModel.aggregate([{
            	"$project": { 
            		'symbol' : 1,
            		'symbol_type' : 1,
            		'image' :'$image_'+theme
            	}
            },{"$match": query }]).skip(start).limit(length);
	        } catch (e) {
	          console.log("Error getSymbolThemeTable",e);
	    	}
	},
}