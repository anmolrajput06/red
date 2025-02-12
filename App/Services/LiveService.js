'use strict';

const mongoose = require('mongoose');
const lineModel  = mongoose.model('line');
const symbolModel  = mongoose.model('symbol');
const betModel  = mongoose.model('bet');
const timeBasedOfferModel  = mongoose.model('timeBasedOffer');
module.exports = { 

	getByData: async function(data){
        console.log('Find By Data:',data)
        try {
			return  await lineModel.find(data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    update: async function(condition, data){
        try {
          await lineModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
    },
    getByOneData: async function(data){
        console.log('Find By Data:',data)
        try {
			return  await lineModel.findOne(data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    create: async function(data) 	{
        try{
            return  await lineModel.create(data);
        }catch (e){
            console.log("Error",e);
        }
    },

    getSymbol: async function(data){
        try {
            return  await symbolModel.find(data);
        } catch (e) {
            console.log("Error",e);
        }
    },
    getOneSymbol: async function(data){
        try {
            return  await symbolModel.findOne(data);
        } catch (e) {
            console.log("Error",e);
        }
    },
    getBet: async function(data){
        try {
            return  await betModel.find(data);
        } catch (e) {
            console.log("Error",e);
        }
    },
    getBetOne: async function(data){
        try {
            return  await betModel.findOne(data);
        } catch (e) {
            console.log("Error",e);
        }
    },
    getOneTimeOffer: async function(data){
        try {
            return  await timeBasedOfferModel.find(data);
        } catch (e) {
            console.log("Error",e);
        }
    },
}
 
 
