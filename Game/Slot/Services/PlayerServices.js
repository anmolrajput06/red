'use strict';
var Sys = require('../../../Boot/Sys');
const mongoose = require('mongoose');
const playerModel  = mongoose.model('player');
const socketModel  = mongoose.model('socket');
const levelModel  = mongoose.model('level');
const userModel  = mongoose.model('user');

module.exports = { 

    create: async function(data){
        try {
            return  await playerModel.create(data);
        } catch (error) {
            Sys.Log.info('player service  Error in create player : ' + error);
        }

    },

    getByOnePlayerData: async function(data){
        try {
            console.log("player data",data);
            // return  await playerModel.findOne(data);
            return  await playerModel.aggregate([
                 { $project: 
                    {
                        game_players: 1,
                        device: 1,
                        socket_id: 1,
                        chips: 1,
                        level: 1,
                        xp: 1,
                        day_count: 1,
                        loginCode: 1,
                        username: 1,
                        status: 1,
                        firstname: 1,
                        lastname: 1,
                        mobile: 1,
                        address: 1,
                        country: 1,
                        city: 1,
                        state: 1,
                        zip_code: 1,
                        avatar: 1,
                        fb_avatar: 1,
                        device_name: 1,
                        _id:0,
                        id:"$_id"
                    }
                },
                { $match : data }]);
        } catch (error) {
            Sys.Log.info('player service  Error in getByOnePlayerData : ' + error);
        }
    },
    
    getOneByData: async function(data,select){
        try {
            return  await playerModel.findOne(data,select);
        }catch (error) {
            Sys.Log.info('player service  Error in getOneByData : ' + error);
        }
    },
    getOneByPlayer: async function(data){
        try {
			return  await playerModel.findOne(data);
        } catch (error) {
            Sys.Log.info('player service  Error in getOneByPlayer : ' + error);
        }
	},
	getPlayerLimitSort: async function(data){
         
        try {
            return  await playerModel.find(data).populate('user').sort('chips DESC').limit(20);
        } catch (error) {
            Sys.Log.info('player service Error in getPlayerLimitSort : ' + error);
        }
    },

    getByData: async function(data){
         
        try {
            return  await playerModel.find(data);
        } catch (error) {
            Sys.Log.info('player service Error Error in getByData : ' + error);
        }
    },

    getByPlayer: async function(data){
         
        try {
            return  await playerModel.find(data).populate('game_players').populate('user');
        } catch (error) {
            Sys.Log.info('player service Error in getByPlayer : ' + error);
        }
    },

    getByGamePlayer: async function(data){
         
        try {
            return  await playerModel.find(data).populate('game_players',{status: "playing"});
        } catch (error) {
            Sys.Log.info('player service Error in getByPlayer : ' + error);
        }
    },

    getByLevel: async function(data){
         
        try {
            return  await levelModel.find(data);
        } catch (error) {
            Sys.Log.info('player service Error Error in getByLevel : ' + error);
        }
    },

    getByLevelSortLevel: async function(data){
         
        try {
            return  await levelModel.find(data).sort('level');
        } catch (error) {
            Sys.Log.info('player service Error Error in getByLevelSortLevel : ' + error);
        }
    },
    
    getByOneLevel: async function(data){
         
        try {
            return  await levelModel.findOne(data);
        } catch (error) {
            Sys.Log.info('player service Error Error in getByOneLevel : ' + error);
        }
    },

    getById: async function(id){
         
        try {
			return  await playerModel.findById(id);
        } catch (error) {
            Sys.Log.info('player service Error Error in getById : ' + error);
        }
	},

    updatePlayer: async function(condition, data){
        try {
          await playerModel.update(condition, data);
        } catch (e) {
          console.log(" player service Error updatePlayer",e);
        }
    },
}
 
 
