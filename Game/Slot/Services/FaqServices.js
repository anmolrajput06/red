'use strict';
var Sys = require('../../../Boot/Sys');
const mongoose = require('mongoose');
const faqModel  = mongoose.model('faq');
const pageModel  = mongoose.model('page');

module.exports = { 
 
    getOneFaq: async function(data){
        try {
            return  await faqModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Faq Service Error in getOneFaq : ' + error);
        }
    },
    getByFaq: async function(data){
        try {
            return  await faqModel.find(data);
        } catch (error) {
            Sys.Log.info('Faq Service Error in getByFaq : ' + error);
        }
    },

    getOnePage: async function(data){
        try {
			return  await pageModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Page Service Error in getOnePage : ' + error);
        }
    },
    getByPage: async function(data){
        try {
			return  await pageModel.find(data);
        } catch (error) {
            Sys.Log.info('Page Service Error in getByPage : ' + error);
        }
    },


}
 
 
