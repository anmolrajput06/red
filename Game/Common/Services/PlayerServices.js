'use strict';
var Sys = require('../../../Boot/Sys');
const mongoose = require('mongoose');
const playerModel = mongoose.model('player');
const socketModel = mongoose.model('socket');
const levelModel = mongoose.model('level');
const webGlRequest = mongoose.model('webGlRequest');
const themeModel = mongoose.model('theme')
const gameModel = mongoose.model('game')
const customerModel = mongoose.model('customer');


module.exports = {

    findOneUser: async function(query){
        try {
            return await customerModel.findOne(query).lean();
        } catch (e) {
            console.log("findOneUser", e);
        }
    },
    findOneUserWithFilter: async function(query,filter){
        try {
            return await customerModel.findOne(query,filter).lean();
        } catch (e) {
            console.log("findOneUser", e);
        }
    },
    updateCoustomer: async function(condition,data){
        try {
            return await customerModel.updateOne(condition,data);
        }catch{
            console.log("updateCoustomer", e);
        }
    },
    create: async function(data) {
        try {
            return await customerModel.create(data);
        } catch (error) {
            Sys.Log.info('create' + error);
        }
    },
}