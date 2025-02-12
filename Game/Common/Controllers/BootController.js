var Sys = require('../../../Boot/Sys');

module.exports = async function(socket){
	let pokerRoom = await Sys.Game.Common.Services.PokerRoomService.update({status:{$nin:'Closed'}});
	if(!pokerRoom){
		return {
            status : 'fail',
            result : null,
            message : 'Poker Room not Found.'
        }
	}else{
	let jackPot = await Sys.Game.Common.Services.JackPotService.getByPlayerID({game:0});
	if(!jackPot){
		return {
            status : 'fail',
            result : null,
            message : 'No Jackpot found.'
        }
     }

	}

	let player = await Sys.Game.Common.Services.SocketServices.update({},{socketId : null});
	socket.on('connection',async function(socket){
		var client = Sys.Io.engine.clients[socket.id];
		client._userData = {
			socketId: socket.id,
			gameType: 'slot'
		};
		if(socket.handshake.query.device_id){
			let getPlayerConn = await Sys.Game.Common.Services.PlayerServices.getOneByData({device: socket.handshake.query.device_id});
			    await Sys.Game.Common.Services.SocketServices.update(
				{
					_id : getPlayerConn.id
				},{
					socket_id: socket.id
				});
		}
		socket.on('disconnect',async function(socket){
			let getPlayer = await Sys.Game.Common.Services.PlayerServices.getOneByData({device: socket.handshake.query.device_id});
			    await Sys.Game.Common.Services.SocketServices.update(
				{
					_id : getPlayer.id
				},{
					socket_id: socket.id
				});
				await Sys.Game.Common.Services.PlayerServices.update(
				{
					_id : getPlayer.id
				},{
					status: null
				});

			let playerOne = await Sys.Game.Common.Services.PlayerServices.getOneByData({device: socket.handshake.query.device_id});
			console.log("yess call");
				if(playerOne){
					let gamePlayer = await Sys.Game.Common.Services.GameService.updateGamePlayer(
					{
						player: playerOne.id,
						status: 'playing'
					},{
						status: 'finished'
					});
					if(gamePlayer.length){
						await Sys.Io.of(Sys.Config.Namespace.Slot).to(jackPot.game).emit('UserRemoved',{
								roomNo : gamePlayer[0].room,
								thems : gamePlayer[0].theme,
								Userremove : gamePlayer[0]
							});
						}
					}

				})

		});
		let jackpot = await Sys.Game.Common.Services.JackPotService.getByDataLimit({});
		if(!jackpot){
			return { 
			  status: 'fail',
			  result: null,
			  message: 'jackPot not Found',
			  statusCode: 401
			}
		}else{
			Sys.Config.Dubai._jackpot = jackpot[0];
		}
			
		setInterval(updateJackpotOnMapScreen, 2000);
		// require('../../../Game/Slot/Sockets');
		GAME_LEVELS = [];
  		let level = await Sys.Game.Common.Services.PlayerServices.getByLevel({});
  		GAME_LEVELS = levels;

}



function updateJackpotOnMapScreen() {
	var localClassicJackpot = Sys.Config.Dubai._jackpot.start_chips, localWildJackpot = Sys.Config.Dubai._jackpot.start_chips;
	Sys.Config.Dubai._rooms.classic.forEach(function (_room) {
		if (_room.jackpot > localClassicJackpot) {
			localClassicJackpot = _room.jackpot;
		}
	})
	Sys.Config.Dubai._rooms.wild.forEach(function (_room) {
		if (_room.jackpot > localWildJackpot) {
			localWildJackpot = _room.jackpot;
		}
	})
	sails.sockets.blast('JackpotUpdatedClassic', { chips: localClassicJackpot });
	sails.sockets.blast('JackpotUpdatedWild', { chips: localWildJackpot });
}
