'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const betModel = mongoose.model("betModel");
const kenoBet = mongoose.model("kenoBet");
const kenoPayoutTable = mongoose.model("kenoPayoutTable");

module.exports = {
    //Function insert bet model for slot 
    insertBetModel: async function(data){
        try {
            return await betModel.create(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    //Function get bet model for slot 
    getBetModel: async function(data) {
        try {
            return await betModel.find(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    //Function insert bet model for keno 
    insertKenoBet: async function(data){
        try {
            return await kenoBet.create(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    //Function get bet model for keno
    getKenoBet: async function(data) {
        try {
            return await kenoBet.find(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    //Function insert bet model for keno 
    insertKenoPayoutTable: async function(data){
        try {
            return await kenoPayoutTable.create(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    //Function get bet model for keno
    getKenoPayoutTable: async function(data) {
        try {
            return await kenoPayoutTable.find(data);
        } catch (e) {
            console.log("Error", e);
        }
    },
}