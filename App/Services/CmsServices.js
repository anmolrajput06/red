'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const cmsModel = mongoose.model('cms');
const webGlRequest = mongoose.model('webGlRequest');
const settingModel = mongoose.model('setting')
const supportCmsModel = mongoose.model('cmsSupport')

module.exports = {

    getAllCms: async function(data) {
        console.log('Find By Data:', data);
        try {
            return await cmsModel.find(data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    getCmsById: async function(data) {
        try {
            return await cmsModel.findOne(data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    updateCms: async function(condition, data) {
        try {
            return await cmsModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    deleteCms: async function(data) {
        try {
            return await cmsModel.deleteOne(data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    getSetting: async function(data) {
        try {
            return await settingModel.findOne(data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    updateSetting: async function(condition, data) {
        try {
            return await settingModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    supportFindAll: async function(data,skip,length) {
        try {
            return await supportCmsModel.find(data).skip(skip).limit(length);
        } catch (e) {
            console.log("Error", e);
        }
    },
    supportCount: async function(data) {
        try {
            return await supportCmsModel.countDocuments(data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    supportFindOne: async function(data) {
        try {
            return await supportCmsModel.findOne(data);
        } catch (e) {
            console.log("Error", e);
        }
    }
}