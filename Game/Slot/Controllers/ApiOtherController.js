var Sys = require('../../../Boot/Sys');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');


module.exports = {

	getFaqs: async function(socket,data){
		try{
			let faq = await Sys.Game.Slot.Services.FaqServices.getByFaq({where:{language:data.language}});
			if(faq == 0){
	            return {
	                status : 'fail',
	                result : null,
	                message : 'Faq not found.'
	            }
	        }else{
	          	return {
                    status: 'success',
                    result: faq,
                    message: 'All faq!'
                }
	        }
		}catch (error){
			Sys.Log.info('Error in getFaqs : ' + error);
	        return new Error('Error in getFaqs');
		}
	},

	getPages: async function(socket,data){
		try{  
			let pages = await Sys.Game.Slot.Services.FaqServices.getByPage({where:{language:data.language}});
	        if(pages == 0){
	            return {
	                status : 'fail',
	                result : null,
	                message : 'Page not found.'
	            }
	        }else{
	          	return {
                    status: 'success',
                    result: pages,
                    message: 'All page!'
                }
	        }
		}catch (error){
			Sys.Log.info('Error in getPages : ' + error);
	        return new Error('Error in getPages');
		}
	},

	getGameSpinReels: async function(socket,data){
		try{
			var newData = {
		        req: data,
		        res: data
		    };
		   await Sys.Game.Slot.Controllers.PlayerController.newSpinReels(newData);
		}catch (error){
			Sys.Log.info('Error in getGameSpinReels : ' + error);
	        return new Error('Error in getGameSpinReels');
		}
	},

	getBonusListByTime: async function(socket,data){
		try{
			let times = await Sys.Game.Slot.Services.TimeBasedOfferServices.getByTimeBasedOffer({});
			if(times == 0){
				return {
	                status : 'fail',
	                result : null,
	                message : 'Time not found.'
	            }
			}else{
				return {
                    status: 'success',
                    result: times,
                    message: 'List of time bonus.'
                }
			}
		}catch (error){
			Sys.Log.info('Error in getBonusListByTime : ' + error);
	        return new Error('Error in getBonusListByTime');
		}
	},

	getBonusListByDay: async function(socket,data){
		try{
			let times = await Sys.Game.Slot.Services.TimeBasedOfferServices.getByDayBaseDoffer({});
			if(times == 0){
				return {
	                status : 'fail',
	                result : null,
	                message : 'Time not found.'
	            }
			}else{
				return {
                    status: 'success',
                    result: times,
                    message: 'List of time bonus.'
                }
			}
		}catch (error){
			Sys.Log.info('Error in getBonusListByDay : ' + error);
	        return new Error('Error in getBonusListByDay');
		}
	},

	getBonusListByLevel: async function(socket,data){
		try{
			let levels = await Sys.Game.Slot.Services.PlayerServices.getByLevelSortLevel({});
			if(levels == 0){
				return {
	                status : 'fail',
	                result : null,
	                message : 'Time not found.'
	            }
			}else{
				return {
                    status: 'success',
                    result: levels,
                    message: 'List of level bonus.'
                }
			}
		}catch (error){
			Sys.Log.info('Error in getBonusListByLevel : ' + error);
	        return new Error('Error in getBonusListByLevel');
		}
	},

	postSupportCreate: async function(socket,data){
		try{
			let support = await Sys.Game.Slot.Services.SupportServices.SupportCreate({
				player: data.playerId,
		        subject: data.subject,
		        message: data.message,
		        read:0,
		        status: 'Pending'
			})
			if(support){
				return {
                    status: 'success',
                    result: support,
                    message: 'New support ticket created successfully.'
                }
			}else{
				return {
	                status : 'fail',
	                result : null,
	                message : 'support not create.'
	            }
			}
		}catch (error){
			Sys.Log.info('Error in postSupportCreate : ' + error);
	        return new Error('Error in postSupportCreate');
		}
	},

	getSupport: async function(socket,data){
		try{
			let supports = await Sys.Game.Slot.Services.SupportServices.getBySupportModel({ player: data.playerId});
			if(supports == 0){
				return {
	                status : 'fail',
	                result : null,
	                message : 'No found support ticket list.'
	            }
			}else{
				return {
                    status: 'success',
                    result: supports,
                    message: 'All support ticket list.'
                }
			}
		}catch (error){
			Sys.Log.info('Error in getSupport : ' + error);
	        return new Error('Error in getSupport');
		}
	},

	getSupportDetail: async function(socket,data){
		try{
			let support = await Sys.Game.Slot.Services.SupportServices.getOneSupport({  player: data.playerId, _id: data.supportId});

			let replies = await Sys.Game.Slot.Services.SupportServices.getBySupportReplay({  support: support.id});

			if(!support){
				return {
	                status : 'fail',
	                result : null,
	                message : 'No found support ticket list.'
	            }
			}else{
				support = support.toObject() // <- HERE IS THE CHANGE!
			    support.replies = replies; // It will work now
				return {
                    status: 'success',
                    result: support,
                    message: 'Single support ticket detail.'
                }
			}
		}catch (error){
			Sys.Log.info('Error in getSupportDetail : ' + error);
	        return new Error('Error in getSupportDetail');
		}
	},

	postSupportReply: async function(socket,data){
		try{
			let reply = await Sys.Game.Slot.Services.SupportServices.supportReplayCreate({  player: data.playerId,
		      	support: data.supportId,
		      	message: data.message,
		      	read:0
		  	});
		  	if(reply){
		  		 await Sys.Game.Slot.Services.SupportServices.getUpdateSupport({_id: data.supportId},
		  		 	{status: 'Pending'});
		  		return {
                    status: 'success',
                    result: reply,
                    message: 'Single support ticket added.'
                }
		  	}else{
		  		return {
	                status : 'fail',
	                result : null,
	                message : 'Single support ticket not added.'
	            }
		  	}
		}catch (error){
			Sys.Log.info('Error in postSupportReply : ' + error);
	        return new Error('Error in postSupportReply');
		}
	},

	playerLeft :  async function(socket,data){
		try{
			// if (!req.isSocket) {return res.badRequest();}
		    let gamePlayer = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({_id : data.gamePlayerID});
		    if(gamePlayer){
		    	await Sys.Game.Slot.Services.GameServices.updateGamePlayer({_id : gamePlayer.id},{status:'finished'});
		    	// sails.sockets.broadcast('room-no-'+ req.params.room+req.params.theme, 'Event-'+data.event, data);
		    	return {
                    status: 'success',
                    result: 'ok',
                    message: 'GamePlayer Status Update Successfully.'
                }
		    }else{
		    	return {
	                status : 'fail',
	                result : null,
	                message : 'GamePlayer Status Not Updated.'
	            }
		    }
		}catch (error){
			Sys.Log.info('Error in playerLeft : ' + error);
	        return new Error('Error in playerLeft');
		}
	}

}