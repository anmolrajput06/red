'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const settingsModel = mongoose.model('setting');
const payoutMasterModel = mongoose.model('payoutMaster');


module.exports = {

    // settings Model start
    getSettingsData: async function(data) {
        try {
            return await settingsModel.findOne(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    getPayoutSettingData: async function(data, columns) {
        try {
            return await settingsModel.findOne(data).select(columns);
        } catch (e) {
            console.log("Catched error SettingsServices.", e);
        }
    },

    getByData: async function(data) {
        try {
            return await settingsModel.find(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    getPayoutFindByData: async function(data, columns) {
        try {
            return await settingsModel.find(data).select(columns);
        } catch (e) {
            console.log("Error", e);
        }
    },

    updateSettingsData: async function(condition, data) {
        try {
            await settingsModel.update(condition, data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    insertSettingsData: async function(data) {
        try {
            await settingsModel.create(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    // PayoutMaster Model start
    insertPayoutMasterData: async function(data) {
        try {
            await payoutMasterModel.create(data);
        } catch (e) {
            console.log("Error in SettingsServices.insertPayoutMasterData: ", e);
        }
    },

    getPayoutCount: async function(data) {
        try {
            return await payoutMasterModel.countDocuments(data);
        } catch (e) {
            console.log("Catched Error in SettingsServices.getPayoutCount :", e);
            return new Error(e);
        }
    },

    getPayoutDatatable: async function(query, length, start) {
        try {
            return await payoutMasterModel.find(query).skip(start).limit(length).sort({ createdAt: -1 });
        } catch (e) {
            console.log("Catched Error in SettingsServices.getPayoutDatatable :", e);
            return new Error(e);
        }
    },

}