'use strict';

const mongoose = require('mongoose');
const chisTransactionsModel = mongoose.model('chipsTransaction');
module.exports = {

    getByChisTransactions: async function(data) {

        try {
            return await chisTransactionsModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getByChisTransactions : ' + error);
        }
    },

    findLastSpin: async function(data) {
        try {
            return await chisTransactionsModel.find(data).sort({ id: -1 }).limit(1);
        } catch (error) {
            console.log('Error in findLastSpin : ', error);
        }
    },


    update: async function(condition, data) {
        try {
            await chisTransactionsModel.update(condition, data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    getByPlayerID: async function(data) {
        console.log('Find By Data:', data)
        try {
            return await chisTransactionsModel.findOne(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    create: async function(data) {
        try {
            return await chisTransactionsModel.create(data);
        } catch (e) {
            console.log("chis transactionsModel Error : create -> ", e);
        }
    },

}