'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const accountModel = mongoose.model('account');
const transactionModel = mongoose.model('transaction');
const withdrawModel = mongoose.model('withdrawHistory');
const playerModel = mongoose.model('players');
const otpModel = mongoose.model('otp');
const DocumentModel = mongoose.model('uploadDocument');
const uploadModel = mongoose.model('uploadDocument');


module.exports = {

    getByAccount: async function(data) {
        try {
            return await accountModel.find(data);
        } catch (e) {
            console.log("getByAccount", e);
        }
    },
    getWithdrawLookup: async function (data) {
        try {
            return await withdrawModel.aggregate(data);
        }
        catch (e) {
            console.log("error", e);
        }
    },
    getOneAccount: async function(data) {
        try {
            return await accountModel.findOne(data);
        } catch (e) {
            console.log("getOneAccount", e);
        }
    },

    getByTransaction: async function(data) {
        try {
            return await transactionModel.find(data);
        } catch (e) {
            console.log("getByTransaction", e);
        }
    },

    getOneTransaction: async function(data) {
        try {
            return await transactionModel.findOne(data);
        } catch (e) {
            console.log("getByTransaction", e);
        }
    },

    createTransaction: async function(data) {
        try {
            return await transactionModel.create(data);
        } catch (e) {
            console.log("createTransaction", e);
        }
    },

    updateTransaction: async function(condition, data) {
        try {
            return await transactionModel.update(condition, data);
        } catch (e) {
            console.log("updateTransaction", e);
        }
    },

    createWithdraw: async function(data) {
        try {
            return await withdrawModel.create(data);
        } catch (e) {
            console.log("createTransaction", e);
        }
    },
    getWithdraw: async function(data) {
        try {
            return await withdrawModel.find(data);
        } catch (e) {
            console.log("getTransaction", e);
        }
    },
    getWithdrawData: async function(data) {
        try {
            return await withdrawModel.aggregate(data);
        } catch (e) {
            console.log("getTransaction", e);
        }
    },
    updateWithdraw: async function(condition, data) {
        try {
            console.log(condition, data);
            return await withdrawModel.updateOne(condition, data);
        } catch (e) {
            console.log("update withdraw", e);
        }
    },
    getOnePlayer: async function(data) {
        try {
            return await playerModel.findOne(data);
        } catch (e) {
            console.log("getOnePlayer", e);
        }
    },

    updatePlayer: async function(condition, data) {
        try {
            return await playerModel.update(condition, data);
        } catch (e) {
            console.log("getOnePlayer", e);
        }
    },

    createOtp: async function(data) {
        try {
            return await otpModel.create(data);
        } catch (e) {
            console.log("createTransaction", e);
        }
    },

    getOneOtp: async function(data) {
        try {
            return await otpModel.findOne(data);
        } catch (e) {
            console.log("getOnePlayer", e);
        }
    },

    updateOtp: async function(condition, data) {
        try {
            return await otpModel.update(condition, data);
        } catch (e) {
            console.log("getOnePlayer", e);
        }
    },

    createDocument: async function(data) {
        try {
            return await DocumentModel.create(data);
        } catch (e) {
            console.log("createDocument", e);
        }
    },
    getOneDocument: async function(data) {
        try {
            return await uploadModel.findOne(data);
        } catch (e) {
            console.log("getOnePlayer", e);
        }
    },
    getDocument: async function(data) {
        try {
            return await uploadModel.find(data);
        } catch (e) {
            console.log("getOnePlayer", e);
        }
    },


}