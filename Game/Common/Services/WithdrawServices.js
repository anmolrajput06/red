'use strict';

const mongoose = require('mongoose');
const withdrawModel = mongoose.model('withdrawHistory');



module.exports = {

    createWithdraw: async function(data) {

        try {
            return await withdrawModel.create(data);
        } catch (error) {
            Sys.Log.info('Error in createWithdraw : ' + error);
        }
    },
    findWithdraw: async function(data) {

        try {
            return await withdrawModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in createWithdraw : ' + error);
        }
    },
    updateWithdraw: async function(condition, data) {

        try {
            return await withdrawModel.updateOne(condition, data);
        } catch (error) {
            Sys.Log.info('Error in createWithdraw : ' + error);
        }
    },
    update: async function(condition, data) {
        try {
            await chisTraModel.update(condition, data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    getByPlayerID: async function(data) {
        console.log('Find By Data:', data)
        try {
            return await chisTraModel.findOne(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    create: async function(data) {
        try {
            return await chisTraModel.create(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

}