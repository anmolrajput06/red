'use strict';
var Sys = require('../../../Boot/Sys');

const mongoose = require('mongoose');
const transactionModel  = mongoose.model('transaction');

module.exports = { 
 
    getOneTransaction: async function(data){
        try {
			return  await transactionModel.findOne(data);
        } catch (error) {
            Sys.Log.info('transaction Service Error in getOneTransaction : ' + error);
        }
    },
    getByTransaction: async function(data){
        try {
			return  await transactionModel.find(data);
        } catch (error) {
            Sys.Log.info('transaction Service Error in getByTransaction : ' + error);
        }
    },

    transactionCreate: async function(data){
        try {
			return  await transactionModel.create(data);
        } catch (error) {
            Sys.Log.info('transaction Service Error in transactionCreate : ' + error);
        }
    },
}
 
 
