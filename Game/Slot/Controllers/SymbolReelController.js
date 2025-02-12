var Sys = require('../../../Boot/Sys');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

module.exports = {  

	symbolReelIndex: async function(socket,data){
	    try{
	    	console.log("symbolReelIndex post data :",data);
	    	let symbolReels = await Sys.Game.Slot.Services.SymbolReelServices.getBySymbolReels({game: data.game});
	    	if(!symbolReels){
	    		return {
		            status: 'fail',
		            result: null,
		            message: 'SymbolReels not Found',
	          }
	    	}else{
	    		var temp = {};
	    		symbolReels.forEach(function (symbolReel) {
	                if (temp[symbolReel.symbol]) {
	                    temp[symbolReel.symbol][symbolReel.reel] = symbolReel.count;
	                } else {
	                    temp[symbolReel.symbol] = {};
	                    temp[symbolReel.symbol][symbolReel.reel] = symbolReel.count;
	                }
	            });
	    		return {
	              status : 'success',
	              result : temp,
	              message : 'List of symbol reels data.'
	            } 
	    	}
	    }catch (error){
	        Sys.Log.info('Error in symbolReelIndex : ' + error);
	        return new Error('Error in symbolReelIndex');
	    }
	},

	symbolReelIndexSave: async function(socket,data){
	  	try{
	  		console.log("symbolReelIndexSave post data :",data);
	  		var symbol_reel = [];

	  		for (let symbol_id in data.matrix) {
	                for (let reel_id in data.matrix[symbol_id]) {
	                    symbol_reel.push({
	                        count: data.matrix[symbol_id][reel_id],
	                        reel: reel_id,
	                        symbol: symbol_id,
	                        game: data.game
	                    });
	                }
	            }

	    	let symbolReels = await Sys.Game.Slot.Services.SymbolReelServices.create(symbol_reel);
	    	if(symbolReels){
	    		return {
	                status : 'success',
	                result : symbolReels,
	                message : 'List of symbolReels data.'
		        }
	    	}else{
	    		return {
		            status: 'fail',
		            result: null,
		            message: 'SymbolReels not Save',
		        }
	    	}

	  	}catch (error){
	  		Sys.Log.info('Error in symbolReelIndexSave : ' + error);
	        return new Error('Error in symbolReelIndexSave');
	  	}
	},

	symbolPayoutIndex: async function(socket,data){
		try{
			let symbolReels = await Sys.Game.Slot.Services.SymbolPayoutService.getFindSymbolPayout({game: data.game});
			if(symbolReels){
				var temp = {};
	            symbolReels.forEach(function (symbolReel) {

	                temp[symbolReel.symbol] = {
	                    symbol: symbolReel.symbol,
	                    one_time: symbolReel.one_time,
	                    two_time: symbolReel.two_time,
	                    three_time: symbolReel.three_time,
	                    four_time: symbolReel.four_time,
	                    five_time: symbolReel.five_time
	                };

	            });
	            return {
	                status : 'success',
	                result : symbolReels,
	                message : 'List of symbol playout data.'
		        }
			}else{
				return {
		            status: 'fail',
		            result: null,
		            message: 'Symbol playout not Save',
		        }
			}
		}catch (error){
			Sys.Log.info('Error in symbolPayoutIndex : ' + error);
	        return new Error('Error in symbolPayoutIndex');
		}
	},

	symbolPayoutIndexSave: async function(socket,data){
		try{
			var symbol_reel = [];
        		for (let symbol_id in data.matrix) {
	                if (data.game != '2') {
	                    symbol_reel.push({
	                        game: data.game,
	                        symbol: symbol_id,
	                        two_time: data.matrix[symbol_id].two_time,
	                        three_time: data.matrix[symbol_id].three_time,
	                        four_time: data.matrix[symbol_id].four_time,
	                        five_time: data.matrix[symbol_id].five_time
	                    });
	                }
	                else {
	                    symbol_reel.push({
	                        game: data.game,
	                        symbol: symbol_id,
	                        one_time: data.matrix[symbol_id].one_time,
	                        two_time: data.matrix[symbol_id].two_time,
	                        three_time: data.matrix[symbol_id].three_time
	                    });
	                }
	            }
        	let SymbolPayout = await Sys.Game.Slot.Services.SymbolPayoutService.symbolPayoutCreate(symbol_reel);
		    	if(SymbolPayout){
		    		return {
		                status : 'success',
		                result : SymbolPayout,
		                message : 'List of symbol payout data.'
			        }
		    	}else{
		    		return {
			            status: 'fail',
			            result: null,
			            message: 'Symbol payout not Save',
			        }
		    	}
		}catch(error){
			Sys.Log.info('Error in symbolPayoutIndexSave : ' + error);
	        return new Error('Error in symbolPayoutIndexSave');
		}
	},
}