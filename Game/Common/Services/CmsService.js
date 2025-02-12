'use strict';

const mongoose = require('mongoose');
const cmsModel = mongoose.model('cms');
const cmsSupportModel = mongoose.model('cmsSupport')



module.exports = {

    getCmsData: async function(data) {

        try {
            return await cmsModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
    },
    createSupport: async function(data) {
        try {
            return await cmsSupportModel.create(data);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
    }


}