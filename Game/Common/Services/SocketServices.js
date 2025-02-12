'use strict';

const mongoose = require('mongoose');
const socketModel = mongoose.model('socket');


module.exports = {

    // update: async function(data){
    //     try {
    //         let socketData = await socketModel.findOneAndUpdate({ playerId : data.playerId }, { socketId: data.socketId });
    //         if(!socketData){
    //             return new Error('No Record Found!');
    //         }else{
    //             return socketData;
    //         }

    //      } catch (e) {
    //         console.log("Error",e);
    //     }
    // },
    update: async function(condition, data) {
        try {
            await socketModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    getByPlayerID: async function(data) {
        console.log('Find By Data:', data)
        try {
            return await socketModel.findOne(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    create: async function(data) {
        try {
            return await socketModel.create(data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    deleteSocketData: async function(data) {
        try {
            console.log("data", data);
            return await socketModel.deleteOne(data);
        } catch (error) {
            Sys.Log.info('Error in deleteSocketData : ' + error);
        }
    },
}