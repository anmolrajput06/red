'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const playerModel = mongoose.model('player');
const withdrawModel = mongoose.model('withdrawHistory')
const userModel = mongoose.model('user')
const withdrawRequestModel = mongoose.model('withdrawRequestHistory')


module.exports = {

    getByData: async function(data) {
        console.log('Find By Data:', data)
        try {
            return await playerModel.find(data).lean();
        } catch (e) {
            console.log("Error", e);
        }
    },
    getWithdrawDatatable: async function(query, length, start,sort) {
        try {
            console.log(sort);
            return await withdrawRequestModel.find(query).skip(start).limit(length).sort(sort);
        } catch (e) {
            console.log("Error", e);
        }
    },
    getWithdrawCount: async function(query) {
        try {
            return await withdrawRequestModel.countDocuments(query)
        } catch (e) {
            console.log("Error", e);
        }
    },
    getPlayerLookupData:async function(data){
        try{
            return await playerModel.aggregate(data);
        }
        catch(e){
            console.log("Error", e);
        }
    },
    withdrawHistoryCreate:async function(data){
        try{
            console.log(data);
            return await withdrawRequestModel.create(data)
        }
        catch(e){
            console.log("Error",e);
        }
    },
    count: async function(data) {
        console.log('Find By Data:', data)
        try {
            return await playerModel.countDocuments(data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    getPlayerData: async function(data, select) {
        try {
            return await playerModel.find(data).select(select);
        } catch (e) {
            console.log("Error", e);
        }
    },

    getOneByData: async function(data, select) {
        try {
            return await playerModel.findOne(data, select);
        } catch (e) {
            console.log("Error in getOneByData", e);
        }
    },

    getSinglePlayerData: async function(data) {
        try {
            return await playerModel.findOne(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    getLimitPlayer: async function(data) {
        try {
            return await playerModel.find(data).limit(8).sort({ createdAt: -1 });
        } catch (e) {
            console.log("Error", e);
        }
    },
getPlayerDataLookupAggregate: async function(data){
    try{
        return await playerModel.aggregate(data);
    }
    catch(e){
        console.log("Error",e);
    }
},

    getPlayerCount: async function(data) {
        try {
            return await playerModel.countDocuments(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    getLimitedPlayerWithSort: async function(data, limit, sortBy, sortOrder) {
        try {
            return await playerModel.find(data).sort({
                [sortBy]: sortOrder
            }).limit(limit);
        } catch (e) {
            console.log("Error", e);
        }
    },

    getPlayerDatatable: async function(query, length, start) {
        try {
            return await playerModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error", e);
        }
    },
    getWithdrawLookup: async function(query) {
        try {
            console.log(query);
            return await withdrawModel.aggregate(query);
        } catch (e) {
            console.log("Error", e);
        }
    },
    getPlayerLookup: async function(query) {
        try {
            console.log(query);
            return await playerModel.aggregate(query);
        } catch (e) {
            console.log("Error", e);
        }
    },
    insertPlayerData: async function(data) {
        try {
            console.log("data", data);
            return await playerModel.create(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    deletePlayer: async function(data) {
        try {
            return await playerModel.deleteOne({ _id: data });
        } catch (e) {
            console.log("Error", e);
        }
    },

    

    getAllPlayersChips: async function(query) {
        try {
            return await playerModel.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: null,
                        chips: { $sum: "$chips" },
                        count: { $sum: 1 },
                    },
                },
            ]);
        } catch (err) {
            console.log('error', err);
            return new Error(err);
        }
    },

}