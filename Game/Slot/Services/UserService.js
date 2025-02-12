'use strict';
var Sys = require('../../../Boot/Sys');

const mongoose = require('mongoose');
const userModel  = mongoose.model('user');

module.exports = { 
 
    getOneuserCreate: async function(data){
        try {
			return  await userModel.create(data);
        } catch (error) {
            Sys.Log.info('User Service Error in getOneuserCreate : ' + error);
        }
    },

    getOneuser: async function(data){
        try {
			return  await userModel.findOne(data);
        } catch (error) {
            Sys.Log.info('User Service Error in getOneuser : ' + error);
        }
    },

    getByuser: async function(data){
        try {
            return  await userModel.find(data);
        } catch (error) {
            Sys.Log.info('User Service Error in getByuser : ' + error);
        }
    },

    userUpdate: async function(condition, data){
        try {
			return  await userModel.update(condition, data);
        } catch (error) {
            Sys.Log.info('User Service Error in userUpdate : ' + error);
        }
    },
}
 
 
