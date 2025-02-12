var Sys = require('../../../Boot/Sys');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var moment = require('moment');
module.exports = {

	login: async function(socket,data){
		try{
			// console.log("socket connect ------->",socket);
			console.log("socket connect conn------->",socket.conn.id);
			console.log("player login =>",data);
			let selectFrields = {id:1,username:1,firstname:1,lastname:1,email:1,loginCode:1,status:1,chips:1,xp:1,level:1} 
			let player = await Sys.Game.Slot.Services.PlayerServices.getOneByData({ loginCode: parseInt(data.login)},selectFrields);
		    if(player instanceof Error){
		        return { status: 'fail', result: null, message: player.message, statusCode: 401 }
		        }
		        if(!player){
		        	return {
	                  status : 'fail',
	                  result : null,
	                  message : 'Player not found.'
	                }
		        }else{
		        	player.level = await Sys.Game.Slot.Controllers.RoomProcess.checkLevel(player.xp);
			        return {
			           status : 'success',
			           result : player,
			           message : 'Player login registerd.'
			        }
		        }
			}catch (error){
				Sys.Log.info('Error in login : ' + error);
		        return new Error('Error in login');
			}
	},

  	register: async function(socket,data){
	    try{

	        let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({device: data.device });
	          if(!player){
	            return {
	                status : 'fail',
	                result : null,
	                message : 'Device not registered.'
	            }
	          }else{
	            var userData = {
	              email: data.email,
	              name : data.username,
	              password : data.password,
	              role: 'user'
	            };
	          let user = await Sys.Game.Slot.Services.UserService.getOneuserCreate(userData);
	          if(user){
	            player.user = user.id;
	            player.username = data.username;
	            player.firstname = data.firstname;
	            player.lastname = data.lastname;
	            player.device = data.device;
	            // player.device = helper.randomString(36);
	            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({_id : player.id},{player});
	              return {
	                status : 'success',
	                result : user,
	                message : 'User registerd successfully.'
	              }
	            }else{
	              return {
	                  status : 'fail',
	                  result : null,
	                  message : 'user not registered.'
	              }
	            }
	          }
		}catch (error){
	        Sys.Log.info('Error in register : ' + error);
	        return new Error('Error in register');
		}
	},

	changePassword: async function(socket,data){
        try {
              
              let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({_id : data.playerId});
              if(!player){ return { status: 'fail', result: null, message: 'Player not Found!',  statusCode: 400 }  }

              if (player) {
                  if (bcrypt.hashSync(data.oldPassword, 10) ==  player.password) {
                      player = await Sys.Game.Slot.Services.PlayerServices.updatePlayer(data.playerId,{password : bcrypt.hashSync(data.newPassword, 10)}); 
                    if (player) {
                      return {
                        status: 'success',
                        result: null,
                        message: 'Player Password Successfully Changed!'
                      }
                    }
                  }
                }
                return {
                  status: 'fail',
                  result: null,
                  message: 'Invalid credentials!',
                  statusCode: 401
                }

	    } catch (error) {
	          Sys.Log.info('Error in changePassword : ' + error);
	    }
	},

  	profileImageUpdate: async function(socket,data){
	    try{
	        // setting allowed file types
	      var allowedTypes = ['image/jpeg', 'image/png'];

	      // skipper default upload directory .tmp/uploads/
	      var allowedDir = "../../assets/uploads/avatar";
	       let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({_id: data.playerId });
	          if(!player){
	            return {
	                status : 'fail',
	                result : null,
	                message : 'Player not Found.'
	            }
	          }else{
	          
	          if(data.avatar){
	            let image = data.avatar;
	            var re = /(?:\.([^.]+))?$/;
	            var ext = re.exec(image)[1];
	            let fileName = Date.now()+'.'+ext;

	            image.mv('./public/profile/'+fileName, async function(err) {
	                console.log("HHHH",err);
	              if (err){
	                  return {
	                    status : 'fail',
	                    result : null,
	                    message : 'No Upload!'
	                  }
	              }

	            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({_id: data.playerId },{
	               avatar: fileName
	            });
	               return {
	                    status : 'success',
	                    result : player,
	                    message : 'Profile update successfully!'
	                  }
	            });
	          }else{
	            return {
	              status : 'fail',
	              result : null,
	              message : 'please select avatar!'
	            }
	          }
		    }
		}catch (error){
		      Sys.Log.info('Error in profileImageUpdate : ' + error);
		      return new Error('Error in profileImageUpdate');
		}
	},

	getPlayersRank: async function(socket,data){
		try{
			let player = await Sys.Game.Slot.Services.PlayerServices.getPlayerLimitSort({});
			if(!player){
	          return {
	            status: 'fail',
	            result: null,
	            message: 'Player not Found',
	          }
	        }else{
	        	player.forEach(async function (player) {
	        		player.level = await Sys.Game.Slot.Controllers.RoomProcess.checkLevel(player.xp);
			        player.user = (player.user) ? player.user.id : null;
			    })
	          return {
	              status : 'success',
	              result : player,
	              message : 'List of game data.'
	          } 
	        }
		}catch (error){
			Sys.Log.info('Error in GetPlayersRank : ' + error);
	        return new Error('Error in GetPlayersRank');
		}
	},

	updateStatus: async function(socket,data){
		try{
			let user = await Sys.Game.Slot.Services.UserService.getOneuser({_id : data.userId});
			if(!user){
	          return {
	            status: 'fail',
	            result: null,
	            message: 'User not Found',
	          }
	        }else{
	        	await Sys.Game.Slot.Services.UserService.userUpdate({ _id : data.userId},{
					status: 'on line'
				});
				// socket.blast('user', user[0]);
				return {
	              status : 'success',
	              result : 'ok',
	              message : 'Status updated successfully.'
	            } 
	        }
		}catch (error){
			Sys.Log.info('Error in updateStatus : ' + error);
	        return new Error('Error in updateStatus');
		}
	},

	updatePlayerStatus: async function(socket,data){
		try{
			console.log("UpdatePlayerStatus data <<====>>",data);
			let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({_id : data.playerId});
			if(!player){
	          return {
	            status: 'fail',
	            result: null,
	            message: 'Player not Found',
	          }
	        }else{
	        	await Sys.Game.Slot.Services.PlayerServices.updatePlayer({_id : data.playerId},{
	        		status : data.status
	        	});
	        	return {
	              status : 'success',
	              result : 'ok',
	              message : 'Status updated successfully.'
	            } 
	        }
		}catch (error){
			Sys.Log.info('Error in UpdatePlayerStatus : ' + error);
	        return new Error('Error in UpdatePlayerStatus');
		}
	},

	purchaseChips: async function(socket,data){
		try{
			let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({_id : data.playerId});
			if(!player){
	          return {
	            status: 'fail',
	            result: null,
	            message: 'Player not Found',
	          }
	        }else{
	        	player.chips = parseInt(data.chips) + player.chips;
	        	await Sys.Game.Slot.Services.PlayerServices.updatePlayer({_id : data.playerId},{
	        		chips : player.chips
	        	});
	        	let transaction = await Sys.Game.Slot.Services.TransactionServices.transactionCreate({
	        		type: 'app purchase',
			        player: player.id,
			        name: player.firstname + ' ' + player.lastname,
			        txnid: data.txnid,
			        amount: data.amount,
			        chips: data.chips,
			        status: 'success'
	        	});
	        	await Sys.Game.Slot.Services.ChipsTransactionServices.create({
	        		player: player.id,
		            // gamePlayer: 0,
		            quantity: data.chips,
		            remaining: player.chips,
		            remark: 'Chips Recharged '+data.chips,
		            type: 'recharge'
	        	});
	        	return {
	              status : 'success',
	              result : transaction,
	              message : 'Chips added into the user account.'
	            } 

	        }
		}catch (error){
			Sys.Log.info('Error in purchaseChips : ' + error);
	        return new Error('Error in purchaseChips');
		}
	},

	purchaseTransactions: async function(socket,data){
		try{
			let transaction = await Sys.Game.Slot.Services.TransactionServices.getOneTransaction({player : data.playerId});
			if(!transaction){
	            return {
		            status: 'fail',
		            result: null,
		            message: 'transaction not Found',
	            }
	        }else{
	        	return {
	              status : 'success',
	              result : transaction,
	              message : 'All transactions.'
	            } 
	        }
		}catch (error){
			Sys.Log.info('Error in purchaseTransactions : ' + error);
	        return new Error('Error in purchaseTransactions');
		}
	},

	getAddAsFriend: async function(socket,data){
		try{
			let friends = await Sys.Game.Slot.Controllers.RoomProcess.searchFriend(data.userId,data.friendId);
			
			if(friends.length > 0){
				await Sys.Io.of(Sys.Config.Namespace.Slot).emit('NewUserJoined',{senderId: data.user_id});
				return {
		            status: 'success',
		            result: 'ok',
		            message: 'Already friend',
	            }
			}

			let friends1 = await Sys.Game.Slot.Controllers.RoomProcess.searchFriend(data.friendId, data.userId);
			if(friends1.length > 0){
				await Sys.Io.of(Sys.Config.Namespace.Slot).emit('NewUserJoined',{senderId: data.user_id});
				return {
		            status: 'success',
		            result: 'ok',
		            message: 'Already friend',
	            }
			}else{
				let createFriend = await Sys.Game.Slot.Services.FriendService.create({
					request_from: data.userId,
		            request_to: data.friendId,
		            status: 'pending'
				});
				if(!createFriend){
					return {
			            status: 'fail',
			            result: null,
			            message: 'Friend not create',
	           		}
				}else{
					let oneFriend = await Sys.Game.Slot.Services.FriendService.getByFriendID({_id: data.friendId});
					if(!oneFriend){
						return {
				            status: 'fail',
				            result: null,
				            message: 'Friend not found',
		           		}
					}else{
			            await Sys.Io.of(Sys.Config.Namespace.Slot).emit('NewUserJoined',{senderId: data.user_id});
						return {
				            status: 'success',
				            result: 'ok',
				            message: 'Friend created successfully.',
		                }
					}
				}
			}

		}catch (error){
			Sys.Log.info('Error in getAddAsFriend : ' + error);
	        return new Error('Error in getAddAsFriend');
		}
	},

	getRemoveAsFriend: async function(socket,data){
		try{
			let friend = await Sys.Game.Slot.Services.FriendService.getByFriendID({
				$or : [{request_from: data.userId,
     					request_to: data.friendId
     				   },
     				   {
     				   	request_from: data.friendId,
     					request_to: data.userId
     				   }]
     				});
  			if(!friend){
  				return {
		            status: 'fail',
		            result: null,
		            message: 'Friend not found',
	           	}
  			}else{
  				await Sys.Game.Slot.Controllers.RoomProcess.removeFriend(friend.id)
  				return {
		            status: 'success',
		            result: 'ok',
		            message: 'Friend delete successfully.',
                }
  			}
		}catch (error){
			Sys.Log.info('Error in getRemoveAsFriend : ' + error);
	        return new Error('Error in getRemoveAsFriend');
		}
	},

	getFriendList: async function(socket,data){
		try{

			let friends = await Sys.Game.Slot.Services.FriendService.getByFriends({$or : [{request_from: data.userId,status: 'approved'},{request_to: data.userId,status: 'approved'}]});
			if(friends){
  				var result = [];
		        friends.forEach(function (friend) {
		          result.push(friend.request_to);
		        });
		        friends.forEach(function (friend) {
		          result.push(friend.request_from);
		        });
		        var userIds = [];
		        result.forEach(function (user) {
		          userIds.push(user.id);
		        });

		        let player = await Sys.Game.Slot.Services.PlayerServices.getByPlayer({_id : userIds});
		        if(!player){
		        	return {
			            status: 'fail',
			            result: null,
			            message: 'Player not found',
	           		}
		        }else{
		        	let players = [];
			          for (let i = 0; i < player.length; i++) {
			            player[i].levelData = checkLevel(player[i].xp);
			            let player = {}
			            // Object.assign(player, player[i])
			            players.push(player)
			        }
			    await Sys.Game.Slot.Controllers.RoomProcess.getMessages(0);
		        }
		    }
		}catch (error){
			Sys.Log.info('Error in getFriendList : ' + error);
	        return new Error('Error in getFriendList');
		}
	},

	getFriendRequestList: async function(socket,data){
		try{
			let friends_with_sender = await Sys.Game.Slot.Services.FriendService.getByFriendsFrom({request_to: data.userId,status: 'pending'});
			console.log("get player data ------------->",friends_with_sender);
			if(!friends_with_sender){
				return {
		            status: 'fail',
		            result: null,
		            message: 'Friend not found',
           		}
			}else{
				if (friends_with_sender.length == 0) {
					return {
			            status: 'fail',
			            result: null,
			            message: 'No new friend request.',
	           		}
		      }
		      var players = [];
		      friends_with_sender.forEach(function (user) {
		        players.push({
		          'id': user.request_from.id,
		          'username': user.request_from.username,
		          'avatar': user.request_from.avatar,
		          'fb_avatar': user.request_from.fb_avatar,
		        });
		      });
		      return {
		            status: 'success',
		            result: players,
		            message: 'Friends list',
	            }
			}
		}catch (error){
			Sys.Log.info('Error in getFriendRequestList : ' + error);
	        return new Error('Error in getFriendRequestList');
		}
	},

	getFriendRequestAction: async function(socket,data){
		try{
			let friend = await Sys.Game.Slot.Services.FriendService.getByFriendLimit({request_from: data.friendId,request_to: data.userId,status: 'pending'});
			if (!friend) {
				return {
		            status: 'fail',
		            result: null,
		            message: 'No request found.',
           		}
		    }else{
		    	if (data.action == 'accept') {
		        friend.status = 'approved'
		        await Sys.Game.Slot.Services.FriendService.update({ _id:friend.id},{status : 'approved'});
		        return {
		            status: 'success',
		            result: null,
		            message: 'Request accepted.',
	            }
		      } else {
		      	await Sys.Game.Slot.Services.FriendService.friendDelete(friend.id);
		      	return {
		            status: 'success',
		            result: null,
		            message: 'Request rejected.',
	            }
		      }
		    }
		}catch (error){
			Sys.Log.info('Error in getFriendRequestAction : ' + error);
	        return new Error('Error in getFriendRequestAction');
		}
	},

	getFriendListOnline: async function(socket,data){
		try{
			let friend = await Sys.Game.Slot.Services.FriendService.getByFriends({
				$or : [{request_from: data.userId,status: 'approved'},{request_to: data.userId,status: 'approved'}]});
			if (!friend) {
				return {
		            status: 'fail',
		            result: null,
		            message: 'No friend found.',
           		}
		    }else{
		    	var result = [];
		        friend.forEach(function (friend) {
		          result.push(friend.request_to);
		        });
		        friend.forEach(function (friend) {
		          result.push(friend.request_from);
		        });

		        var userIds = [];
		        result.forEach(function (user) {
		          userIds.push(user.id);
		        });
		        let players = await Sys.Game.Slot.Services.PlayerServices.getByPlayer({_id: userIds,socket_id: null});
			        players.forEach(async function (player, key) {
		            player.levelData = await Sys.Game.Slot.Controllers.RoomProcess.checkLevel(player.xp);
		            if(player.game_players.length > 0){
		              if(player.game_players[0].game == 2){
		                player.roomId = 0;
		              }
		              else{
		                player.roomId = player.game_players[0].id;
		              }
		            }
		            else{
		              player.roomId = 0;
		            }
		            player.theme = (player.game_players.length > 0) ? player.game_players[0].theme : null
		            player.game_players = {};
		          })
			        let task = [];
		            let plrObj = {};
		            let plrArr = [];
			       players.forEach(async function(plr){
			       	task.push(async function(callback){
		              let result = {};
		            let count = await Sys.Game.Slot.Services.FriendService.getMessageCount({isRead: false,sender: plr.id,reciever: data.userId})
		            })
		            // result.count = count;
		            let room = await Sys.Game.Slot.Services.FriendService.getByPokerRoom({players: { $regex: '.*' + plr.id+ '.*' }});
			            if (room.length > 0) {
		                    result.tableId = room[0].id;
		                } else {
		                    result.tableId = 0;
		                }
		            // callback(null, result);
		            return result;
			       });
			       async.parallel(task,function(err, results) {
		            players.forEach(function(plr, key){
			              plrObj = {};
			              plrObj = plr;
			              plrObj.messageCount = results[key].count;
			              plrObj.tableId = results[key].tableId;
			              plrArr.push(plrObj);
			            });
		            	return {
				            status: 'success',
				            result: plrArr,
				            message: 'Friends list.',
			            }
			          });
					}

		}catch (error){
			Sys.Log.info('Error in getFriendListOnline : ' + error);
	        return new Error('Error in getFriendListOnline');
		}
	},

	getFriendInvite: async function(socket,data){
		try{
			let player = await Sys.Game.Slot.Services.PlayerServices.getByGamePlayer({$or : [{_id: data.friendId},{id: data.userId}]});
			if(!player){
	          return {
	            status: 'fail',
	            result: null,
	            message: 'Player not found',
	          }
	        }else{
	        	var gamePlayer = {
			        game: 1,
			        player: player,
			        status: 'not playing',
			        room: 0,
			        createdAt: new Date(),
			        updatedAt: new Date(),
			        id: 0
			    };
			    gamePlayer.theme = player.game_players[0].theme;
		        delete player.game_players;
		        gamePlayer.player = player;

		        await Sys.Io.of(Sys.Config.Namespace.Slot).to(gamePlayer.player.socket_id).emit('InviteRequest',{gamePlayer});
		        return {
		            status: 'success',
		            result: 'ok',
		            message: 'Invite request sent successfully.',
	            }
        
	        }
		}catch (error){
			Sys.Log.info('Error in getFriendInvite : ' + error);
	        return new Error('Error in getFriendInvite');
		}
	},

	getMyGiftList: async function(socket,data){
		try{
			let giftPlayers = await Sys.Game.Slot.Services.GiftService.getByGiftPlayer({type: "receiver",player: data.playerId});

			let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({_id: data.playerId});

			player.gifts = [];
			giftPlayers.forEach(function (giftPlayer) {
	        var validTill = moment(giftPlayer.createdAt).add(giftPlayer.gift.valid_for, 'hours');
	        var now = moment();
	          if (now < validTill) {
	            giftPlayer.gift.giftId = giftPlayer.id;
	            player.gifts.push(giftPlayer.gift);
	          }
	        });
			return {
	            status: 'success',
	            result: player,
	            message: 'Player with gifts.',
	        }
		}catch (error){
			Sys.Log.info('Error in getMyGiftList : ' + error);
	        return new Error('Error in getMyGiftList');
		}
	},

	setMyGiftList: async function(socket,data){
		try{
			let giftPlayers = await Sys.Game.Slot.Services.GiftService.getByOneGiftPlayer({_id: data.giftPlayerId});

			if (giftPlayers && giftPlayers.length != 0) {
				var now = moment();

		        await Sys.Game.Slot.Services.GiftService.gitPlayerUpdate({_id: data.giftPlayerId},{updatedAt: now});

		        return {
		            status: 'success',
		            result: null,
		            message: 'Player with gifts.',
		        }
		    }else {
		    	return {
		            status: 'fail',
		            result: null,
		            message: 'Player with gifts',
		        }
		    }
		}catch (error){
			Sys.Log.info('Error in setMyGiftList : ' + error);
	        return new Error('Error in setMyGiftList');
		}
	}

}