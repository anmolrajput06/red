var Sys = require('../../../Boot/Sys');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
// var helper = require('../others/helper');

module.exports = {  

  getUserLogin: async function(socket,data){
    try{
       
    }catch (error){
         Sys.Log.info('Error in getUserLogin : ' + error);
         return new Error('Error in getUserLogin');
    }
  }


}