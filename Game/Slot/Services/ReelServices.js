'use strict';
var Sys = require('../../../Boot/Sys');

const mongoose = require('mongoose');
const reelModel  = mongoose.model('reel');

module.exports = { 
 
    getOneReel: async function(data){
        try {
			return  await reelModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Reel Service Error in getOneReel : ' + error);
        }
    },
    getByReel: async function(data){
        try {
			return  await reelModel.find(data);
        } catch (error) {
            Sys.Log.info('Reel Service Error in getByReel : ' + error);
        }
    },
}
 
 
