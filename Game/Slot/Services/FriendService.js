'use strict';

const mongoose = require('mongoose');
const friendModel  = mongoose.model('friend');
const messageModel  = mongoose.model('message');
const pokerRoomModel  = mongoose.model('pokerRoom');



module.exports = { 

    getByData: async function(data){  
        try {
            return  await friendModel.find(data);
        } catch (error) {
            Sys.Log.info('Friend service Error in getByData : ' + error);
        }
    },

    getByFriendsFrom: async function(data){
         
        try {
            // {select: ['id', 'username', 'avatar', 'fb_avatar', 'user']  }
            return  await friendModel.find(data).populate('request_from',{id:1, username:1, avatar:1, fb_avatar:1, user:1});
        } catch (error) {
            Sys.Log.info('Friend service Error in getByFriendsFrom : ' + error);
        }
    },

    getByFriends: async function(data){
         
        try {
            return  await friendModel.find(data).populate('request_to').populate('request_from');
        } catch (error) {
            Sys.Log.info('Friend service Error in getByFriends : ' + error);
        }
    },
	getMessageCount: async function(data){
	         
        try {
            return  await messageModel.find(data).count();
        } catch (error) {
            Sys.Log.info('Friend service Error in getByData : ' + error);
        }
	},

	getFriendCount: async function(data){
		         
	    try {
	        return  await friendModel.find(data).count();
	    } catch (error) {
	        Sys.Log.info('Friend service Error in getByData : ' + error);
	    }
	},


    update: async function(condition, data){
        try {
          await friendModel.update(condition, data);
        } catch (e) {
          console.log("Friend service Error update",e);
        }
    },

    getByFriendID: async function(data){
        try {
            return  await friendModel.findOne(data);
        } catch (e) {
            console.log("Friend service Error getByFriendID",e);
        }
    },

   getByFriendLimit: async function(data){
        try {
			return  await friendModel.findOne(data).limit(1);
        } catch (e) {
            console.log("Friend service Error getByFriendLimit",e);
        }
    },

    create: async function(data)    {
        try{
            return  await friendModel.create(data);
        }catch (e){
            console.log("Friend service Error create",e);
        }
    },

    friendDelete: async function(data)    {
        try{
            return  await friendModel.deleteOne({_id: data});
        }catch (e){
            console.log("Friend service Error friendDelete",e);
        }
    },

    getByPokerRoom: async function(data){
        try {
            return  await pokerRoomModel.find(data);
        } catch (error) {
            Sys.Log.info('Friend service Error in getByPokerRoom : ' + error);
        }
    },

    getByOnePokerRoom: async function(data){
        try {
            return  await pokerRoomModel.findOne(data).sort('createdAt DESC');
        } catch (error) {
            Sys.Log.info('Friend service Error in getByOnePokerRoom : ' + error);
        }
    },


}
 
 
