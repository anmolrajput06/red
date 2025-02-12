var Sys = require('../../../Boot/Sys');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var moment = require('moment');
var Jimp = require('jimp');
var path = require('path');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
// var helper = require('../others/helper');

module.exports = {

    getGames: async function(socket, data) {
        try {
            let game = await Sys.Game.Slot.Services.GameServices.getByGame({});
            if (!game) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Game not Found',
                }
            } else {
                return {
                    status: 'success',
                    result: { gameList: game },
                    message: 'List of game data.'
                }
            }
        } catch (error) {
            console.log('Error in getGames : ', error);
            return new Error('Error in getGames');
        }
    },

    getJoinGame: async function(socket, data) {
        try {
            console.log("get getJoinGame --->", data);
            let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ _id: data.playerId });
            console.log(player);
            if (!player) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Device not registered.'
                }
            } else {
                let playerData = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ _id: data.playerId, isGuestPlayer: true });
                console.log("playerData", playerData);
                if (playerData) {
                    let joinGameGuestCheck = await Sys.Game.Slot.Services.ChipsTransactionService.getByChisTransactions({ player: playerData._id, type: "win", createdAt: { $lte: new Date() } })
                    console.log(joinGameGuestCheck);
                    // if (joinGameGuestCheck.length) {
                    //     return {
                    //         status: 'fail',
                    //         result: null,
                    //         message: 'If you want to play with real money please contact your agent '
                    //     }
                    // } else {
                        let joinGameCheck = await Sys.Game.Slot.Controllers.RoomProcess.joinGameCheck(player, data);
                        return {
                            status: 'success',
                            result: joinGameCheck,
                            message: null
                        }
                    // }
                } else {
                    let joinGameCheck = await Sys.Game.Slot.Controllers.RoomProcess.joinGameCheck(player, data);
                    console.log(joinGameCheck);
                    return {
                        status: 'success',
                        result: joinGameCheck,
                        message: null
                    }
                }
                // return joinGameCheck;
            }
        } catch (error) {
            console.log('Error in getJoinGame : ', error);
            return new Error('Error in getJoinGame');
        }
    },

    getTheme: async function(socket, data) {
        try {
            let columns = ['theme_icon', 'name', 'id'];
            let getTheme = await Sys.Game.Slot.Services.ThemeServices.getByThemeSelect({}, columns);
            if (!getTheme) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Theme not Found',
                }
            } else {
                for (let i = 0; i < getTheme.length; i++) {
                    getTheme[i].theme_icon = '/uploads/' + getTheme[i].theme_icon;
                }
                return {
                    status: 'success',
                    result: {
                        getTheme: getTheme
                    },
                    message: 'All Themes'
                }
            }

        } catch (error) {
            console.log('Error in getTheme : ', error);
            return new Error('Error in getTheme');
        }
    },

    getLines: async function(socket, data) {
        try {
            console.log("get lines data --------------->>>>>", data);
            let game = await Sys.Game.Slot.Services.GameServices.getOneGameMultipleModel({ _id: data.gameId });
            if (!game) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Game not Found',
                }
            }

            let lines = await Sys.Game.Slot.Services.SlotGameServices.getByLine({ game: data.gameId });

            let reel = await Sys.Game.Slot.Services.SlotGameServices.getByreel({ game: data.gameId });
            let rows = await Sys.Game.Slot.Services.SlotGameServices.getByrow({ game: data.gameId });
            console.log("line count ", lines.length);
            lines = JSON.stringify(lines);
            lines = JSON.parse(lines);
            lines.forEach(function(line) {

                var row = [];
                for (let row_id in line.matrix) {
                    for (let column_id in line.matrix[row_id]) {
                        if (line.matrix[row_id][column_id]) {
                            row.push({ row: row_id, col: column_id });
                        }
                    }
                }
                row.sort(function(a, b) { return (a.col > b.col) ? 1 : ((b.col > a.col) ? -1 : 0); });
                var rowData = [];
                rows.forEach(function(row) {
                    rowData.push(row.id)
                });
                var cols = [];
                reel.forEach(function(reel) {
                    cols.push(reel.id)
                });
                line.matrix = [];
                row.forEach(function(cell) {
                    var rowIndex = rowData.indexOf(cell.row) + 1;
                    var colIndex = cols.indexOf(cell.col) + 1;
                    line[`m${rowIndex}${colIndex}`] = true;
                });
            });

            return {
                status: 'success',
                result: { getLines: lines },
                message: null
            }

        } catch (error) {
            console.log('Error in getLines : ', error);
            return new Error('Error in getLines');
        }
    },
    getSymbols: async function(socket, data) {
        try {
            console.log("get player data ", data)
            let getSymbol = await Sys.Game.Slot.Services.SymbolServices.getSymbol({ game: data.gameId })
            let AllSymbol = [];
            AllSymbol = JSON.stringify(AllSymbol);
            AllSymbol = JSON.parse(AllSymbol);
            let themeData = await Sys.Game.Slot.Services.ThemeServices.getOneTheme({ _id: data.themeId });
            for (var i = 0; i < getSymbol.length; i++) {
                let query = { theme: data.themeId, symbol: getSymbol[i].id };
                let symbolImage = await Sys.Game.Slot.Services.ThemeServices.getBySymbolImage(query);
                for (var j = 0; j < symbolImage.length; j++) {
                    AllSymbol.push({
                        'symbol': getSymbol[i].symbol,
                        'symbol_type': getSymbol[i].symbol_type,
                        // 'name' : symbolImage[j].theme.name,
                        'image': symbolImage[j].image,
                        'img_id': symbolImage[j].id,
                        'symbol_id': symbolImage[j].symbol
                    });
                }
            }
            let themeImg = '/uploads/' + themeData.theme_bg;
            let themeImgNames = themeData.theme_bg.split('.');
            let themeImgName = themeImgNames[0];
            let reelBg = '/uploads/' + themeData.reel_bg;
            let reelBgNames = themeData.reel_bg.split('.');
            let reelBgName = reelBgNames[0];
            let reelFrame = '/uploads/' + themeData.reel_frame;
            let reelFrameNames = themeData.reel_frame.split('.');
            let reelFrameName = reelFrameNames[0];
            if (AllSymbol == 0) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Symbol not Found',
                }
            } else {
                return {
                    status: 'success',
                    result: {
                        getSymbol: AllSymbol,
                        theme_bg: themeImg,
                        reel_bg: reelBg,
                        reel_frame: reelFrame,
                        themeImgName: themeImgName,
                        reelBgName: reelBgName,
                        reelFrameName: reelFrameName
                    },
                    message: 'All Symbols'
                }
            }
        } catch (error) {
            console.log('Error in getSymbols : ', error);
            return new Error('Error in getSymbols');
        }
    },

    getGamesHistory: async function(socket, data) {
        try {
            let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ _id: data.playerId });
            if (!player) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No player found.'
                }
            }
            data.skip = data.page * data.limit;
            data.skip = data.skip - data.limit;
            var page = data.page;

            let gamePlayer = await Sys.Game.Slot.Services.GameServices.getByDataGamePlayer({ $and: [{ player: player.id }, { status: 'finished' }] });
            if (!gamePlayer) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No result found.'
                }
            }
            let gamePlayerCount = await Sys.Game.Slot.Services.GameServices.gamePlayerCount({ $and: [{ player: player.id }, { status: 'finished' }] });
            if (!gamePlayerCount) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No result found.'
                }
            } else {
                // defaul limit set
                var limit = 5;
                var length = gamePlayerCount / limit;
                var remander = gamePlayerCount % limit;
                length = (parseInt(length) + parseInt((remander) ? 1 : 0))
                metaInfo = {
                    limit: limit,
                    total: gamePlayerCount,
                    current_page: parseInt(page),
                    pages: Array.apply(null, { length: length }).map(function(value, index) { return index + 1; })
                };
                return {
                    status: 'success',
                    message: 'List of games played by this device.',
                    result: { info: metaInfo, items: gamePlayer }
                }
            }
        } catch (error) {
            console.log('Error in getGamesHistory : ', error);
            return new Error('Error in getGamesHistory');
        }
    },
    getGamesHistoryDetail: async function(socket, data) {
        try {
            let gamePlayer = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({ _id: data.id });
            if (!gamePlayer) {
                return {
                    status: 'fail',
                    result: err,
                    message: 'No result found.'
                }
            }
            return {
                status: 'success',
                message: 'Game detail.',
                result: gamePlayer
            }
        } catch (error) {
            console.log('Error in getGamesHistoryDetail : ', error);
            return new Error('Error in getGamesHistoryDetail');
        }
    },
    getRoomUsers: async function(socket, data) {
        try {
            let gamePlayer = await Sys.Game.Slot.Services.GameServices.joinQuery({ $and: [{ room: data.id }, { theme: data.theme }, { game: data.game }, { status: 'playing' }] });
            if (!gamePlayer) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No result found.'
                }
            }
            for (var i = 0; i < gamePlayer.length; i++) {
                let temp = {
                    status: gamePlayer[i].status,
                    id: gamePlayer[i].player.id,
                    device: gamePlayer[i].player.device,
                    username: gamePlayer[i].player.username
                }

                gamePlayer[i] = temp;
            }

            return {
                status: 'success',
                message: 'Game detail.',
                result: gamePlayer
            }
        } catch (error) {
            console.log('Error in getRoomUsers : ', error);
            return new Error('Error in getRoomUsers');
        }
    },
    getRoomUsersDetail: async function(socket, data) {
        try {
            let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ _id: data.player_id });
            if (!player) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'player not Found',
                }
            }
            if (player.statistics != null && player.statistics.hasOwnProperty('biggest_win')) {
                player.biggest_win = player.statistics.biggest_win;
            } else {
                player.biggest_win = 0;
            }
            player.level = await Sys.Game.Slot.Controllers.RoomProcess.checkLevel(player.xp);
            return {
                status: 'success',
                message: 'Game detail.',
                result: player
            }
        } catch (error) {
            console.log('Error in getRoomUsersDetail : ', error);
            return new Error('Error in getRoomUsersDetail');
        }
    },
    getJoinGameByRoom: async function(socket, data) {
        try {
            // await Sys.Game.Slot.Controllers.RoomProcess.joinGameSlot(data); 
            let gamePlayers = await Sys.Game.Slot.Services.GameServices.getByDataGamePlayer({
                game: data.game_id,
                room: data.room_id,
                theme: data.theme
            });
            if (!gamePlayers) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No result found.'
                }
            }
            if (gamePlayers.length < 6) {
                let game_player = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({
                    player: data.player_id,
                    game: data.game_id,
                    status: 'playing'
                });
                if (!game_player) {
                    return {
                        status: 'fail',
                        result: null,
                        message: 'No result found.'
                    }
                }
                if (game_player) {
                    let game_player = await Sys.Game.Slot.Services.GameServices.updateGamePlayer({
                        _id: game_player.id
                    }, {
                        status: 'finished'
                    });
                    return await Sys.Game.Slot.Controllers.RoomProcess.joinGameSlot(data);
                } else {
                    return await Sys.Game.Slot.Controllers.RoomProcess.joinGameSlot(data);
                }
            } else {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No space found for new user to join in this room.'
                }
            }
        } catch (error) {
            console.log('Error in getJoinGameByRoom : ', error);
            return new Error('Error in getJoinGameByRoom');
        }
    },
    getBets: async function(socket, data) {
        try {
            let bets = await Sys.Game.Slot.Services.SlotGameServices.getBet({ game: data.gameId });
            if (!bets) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No result found.'
                }
            }
            return {
                status: 'success',
                result: bets,
                message: 'All bets list.'
            }
        } catch (error) {
            console.log('Error in getBets : ', error);
            return new Error('Error in getBets');
        }
    },
    getAddBonasToPlayerBydeviceAndTimeId: async function(socket, data) {
        try {
            player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ device: data.device });
            if (!player) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'player not Found'
                }
            }
            let offer = await Sys.Game.Slot.Services.SlotGameServices.getOneTimeOffer({ _id: data.id });
            if (!offer) {
                return {
                    status: 'fail',
                    result: err,
                    message: 'Server error'
                }
            }
            player.chips = parseInt(player.chips) + parseInt(offer.chips);
            var xp = parseInt(player.xp) + 50;
            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({ _id: player.id }, { chips: player.chips, xp: xp });
            return {
                status: 'success',
                result: 'ok',
                message: 'Bonus added to player account.'
            }

        } catch (error) {
            console.log('Error in getAddBonasToPlayerBydeviceAndTimeId : ', error);
            return new Error('Error in getAddBonasToPlayerBydeviceAndTimeId');
        }
    },
    getAddBonasToPlayerBydeviceAndLevelId: async function(socket, data) {
        try {
            player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ device: data.device });
            if (!player) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'player not Found'
                }
            }
            let offer = await Sys.Game.Slot.Services.PlayerServices.getByOneLevel({ _id: data.id });
            if (!offer) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Level not Found'
                }
            }
            player.chips = parseInt(player.chips) + parseInt(offer.bonus);
            var xp = parseInt(player.xp) + 50;
            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({ id: player.id }, { chips: player.chips, xp: xp });
            return {
                status: 'success',
                result: 'ok',
                message: 'Bonus added to player account.'
            }
        } catch (error) {
            console.log('Error in getAddBonasToPlayerBydeviceAndLevelId : ', error);
            return new Error('Error in getAddBonasToPlayerBydeviceAndLevelId');
        }
    },
    jackpot: async function(socket, data) {
        try {
            let bets = await Sys.Game.Slot.Services.SlotGameServices.getBet({ jackpot_eligible: true });
            if (!bets) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Something is wrong.'
                }
            }
            var eligibleBets = [];
            bets.forEach(function(bet) {
                eligibleBets.push(bet.chips);
            });

            if (!eligibleBets.length) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No bet is eligible for jackpot.'
                }
            }
            let game_players = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({ $where: { status: 'playing', room: data.room_id } });
            if (!game_players) {
                return {
                    status: 'fail',
                    result: err,
                    message: 'No player Playing.'
                }
            }
            var totalBets = 0;
            var playerArray = [];
            game_players.forEach(function(game_player) {
                totalBets += game_player.chipsTransactions.length;
            });
            if (totalBets == 0) {
                data.status = 'fail';
                data.result = null;
                data.message = 'Bets are not eligible for jackpot';
                return res.send(data);
            }
            game_players.forEach(function(game_player) {
                game_player.percent = (game_player.chipsTransactions.length / totalBets) * 100;
                for (var i = game_player.percent - 1; i >= 0; i--) {
                    playerArray.push({
                        game_player: game_player.id,
                        player: game_player.player
                    });
                }
            });
            var winner = playerArray[getRandomIntInclusive(0, 99)];
            let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ device: data.device });
            if (!player) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'player not Found'
                }
            }
            player.chips = parseInt(player.chips) + parseInt(data.chips);
            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                _id: player.id
            }, {
                chips: player.chips
            });
            let transaction = await Sys.Game.Slot.Services.ChipsTransactionService.create({
                player: player.id,
                gamePlayer: winner.game_player,
                quantity: parseInt(data.chips),
                remaining: player.chips,
                remark: 'jackpot in game',
                type: 'win'
            });
            if (!transaction) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Something is wrong.'
                }
            }
            await Sys.Io.of(Sys.Config.Namespace.Slot).to(data.room_id).emit('Jackpot', {
                transaction: transaction
            });
            return {
                status: 'success',
                result: transaction,
                message: 'Jackpot distributed successfully.'
            }


        } catch (error) {
            console.log('Error in jackpot : ', error);
            return new Error('Error in jackpot');
        }
    },
    newSpinReels: async function(socket, data) {
        /*
          device : 2
          id : 5bd6e892e6e06d1a9e593975
          status : playing
          bet : 5bdaa9a99a5de86783d335cb
          lines : 9
          bonus : 0
        */
        try {

            console.log("newSpinReels data ---------------->", data);
            let reqData = data;
            var resData = data;
            /* let lastRecord = await Sys.Game.Slot.Services.ChipsTransactionService.findLastSpin({spin : {$ne : '0'}});
            if(lastRecord instanceof Error){
                return {
                  status : 'fail',
                  result : null,
                  message : 'Transaction not found.'
                }
            }
            var lastSpin = lastRecord.length ? lastRecord[0].spin : 0; */
            var lastSpin = new ObjectId();
            let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ _id: data.playerId });
            if (!player) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No player find.'
                }
            }
            // let bet = data.bet;
            let bet = await Sys.Game.Slot.Services.SlotGameServices.getBetOne({ _id: data.bet });
            if (!bet) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No Bet result found.'
                }
            }
            let gamePlayer = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({ game: data.id, player: player.id, status: 'playing' });
            if (!gamePlayer) {
                console.log("player data resData", resData);
                return {
                    status: 'fail',
                    result: null,
                    message: 'This player not joined any room.'
                }
            }
            if (bet.jackpot_eligible) {
                await Sys.Game.Slot.Controllers.RoomProcess.updatedRoomJackpot(gamePlayer.room, gamePlayer.theme);
            }
            let game = await Sys.Game.Slot.Services.GameServices.getByOneGame({ _id: data.id });
            let remainingChips = player.chips;
            let spinreels = {
                status: 'fail',
                result: null,
                message: 'Something Went Wrong.'
            };
            if (data.bonus == 1) {
                spinreels = await Sys.Game.Slot.Controllers.RoomProcess.spinReels(player, gamePlayer, bet, game, true, 0, lastSpin, data);
            } else {
                await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                    _id: player.id
                }, {
                    chips: parseInt(player.chips) - (parseInt(bet.chips) * parseInt(data.lines))
                });
                player.chips = parseInt(player.chips) - (parseInt(bet.chips) * parseInt(data.lines));

                spinreels = await Sys.Game.Slot.Controllers.RoomProcess.spinReels(player, gamePlayer, bet, game, false, remainingChips, lastSpin, data);
            }
            return spinreels;

        } catch (error) {
            console.log('Error in newSpinReels : ', error);
            return new Error('Error in newSpinReels');
        }
    },
    getPayoutDetail: async function(socket, data) {
        try {
            console.log("getPayoutDetail responce <<=======>>>", data);
            let symbol = await Sys.Game.Slot.Services.SlotGameServices.getSymbol({ game: data.gameId });
            if (!symbol) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Something is wrong.'
                }
            }
            let payouts = await Sys.Game.Slot.Services.SlotGameServices.getBySymbolPayout({ game: data.gameId });
            if (!payouts) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Something is wrong.'
                }
            }

            let result = [];
            let symbolIds = [];
            for (var i = 0; i < symbol.length; i++) {
                for (var p = 0; p < payouts.length; p++) {
                    if (symbol[i].id == payouts[p].symbol) {
                        payouts[p].type = symbol[i].symbol_type;
                        result.push(payouts[p]);
                        symbolIds.push(symbol[i].id);
                        break;
                    }
                }
            }

            for (var m = 0; m < symbol.length; m++) {
                let flag = false;
                for (var n = 0; n < symbolIds.length; n++) {
                    if (symbol[m].id == symbolIds[n]) {
                        flag = true;
                        break;
                    }
                }
                if (flag == false) {
                    result.push({
                        symbol: symbol[m].id,
                        type: symbol[m].symbol_type
                    });
                }
            }
            // console.log("result : ", result);
            var final = [];
            for (var i = 0; i < result.length; i++) {
                if (result[i].type == 'symbol' || result[i].type == 'bonus') {
                    if (result[i].one_time != 0) {
                        final.push({
                            'id': result[i].symbol,
                            'data': result[i].one_time,
                            'pay': 'one_time',
                            'type': result[i].type
                        });
                    }
                    if (result[i].two_time != 0) {
                        final.push({
                            'id': result[i].symbol,
                            'data': result[i].two_time,
                            'pay': 'two_time',
                            'type': result[i].type
                        });
                    }
                    if (result[i].three_time != 0) {
                        final.push({
                            'id': result[i].symbol,
                            'data': result[i].three_time,
                            'pay': 'three_time',
                            'type': result[i].type
                        });
                    }
                    if (result[i].four_time != 0) {
                        final.push({
                            'id': result[i].symbol,
                            'data': result[i].four_time,
                            'pay': 'four_time',
                            'type': result[i].type
                        });
                    }
                    if (result[i].five_time != 0) {
                        final.push({
                            'id': result[i].symbol,
                            'data': result[i].five_time,
                            'pay': 'five_time',
                            'type': result[i].type
                        });
                    }
                } else {
                    final.push({
                        'id': result[i].symbol,
                        'data': 0,
                        'pay': '',
                        'type': result[i].type
                    });
                }
            }
            final.sort(function(a, b) {
                return b.data - a.data;
            });

            return {
                status: 'success',
                result: { payoutResult: final },
                message: null
            }
        } catch (error) {
            console.log('Error in getPayoutDetail : ', error);
            return new Error('Error in getPayoutDetail');
        }
    },
    postLocalEvent: async function(socket, data) {
        try {
            if (!data.isSocket) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'dujane loop like bad request'
                }
            }
            await Sys.Game.Slot.Services.GameServices.updateGamePlayer({
                _id: data.gamePlayerID
            }, {
                status: 'finished'
            });
            await Sys.Io.of(Sys.Config.Namespace.Slot).to(data.room).emit('Event', {
                room: data.room,
                theme: data.theme,
                event: data.event,
                data: data
            });
            return {
                status: 'success',
                result: null,
                message: 'OK'
            }
        } catch (error) {
            console.log('Error in postLocalEvent : ', error);
            return new Error('Error in postLocalEvent');
        }
    },
    getGiftList: async function(socket, data) {
        try {
            let gifts = await Sys.Game.Slot.Services.GiftService.getByGift({});
            if (!gifts) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Gift not found'
                }
            }
            return {
                status: 'success',
                result: gifts,
                message: 'List of gift.'
            }
        } catch (error) {
            console.log('Error in getGiftList : ', error);
            return new Error('Error in getGiftList');
        }
    },
    getGiftSendReceive: async function(socket, data) {
        try {
            let gift = await Sys.Game.Slot.Services.GiftService.getByOneGift({ _id: data.gift_id });
            if (!gift) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Gift not found'
                }
            }
            let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ _id: data.sender_id });
            if (!player) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'player not found'
                }
            }
            player.chips = player.chips - gift.chips;
            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                _id: player.id
            }, {
                chips: player.chips
            });
            var giftPlayers = [];
            giftPlayers.push({
                gift: gift.id,
                player: player.id,
                type: 'sender',
                game: data.game,
                // createdAt: new Date(),
                // updatedAt: new Date()
            });
            giftPlayers.push({
                gift: gift.id,
                player: data.receiver_id,
                type: 'receiver',
                game: data.game,
            });
            giftPlayers = await Sys.Game.Slot.Services.GiftService.createGiftPlayer(giftPlayers);
            if (!giftPlayers) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Gift players not create'
                }
            }
            let transaction = await Sys.Game.Slot.Services.ChipsTransactionService.create({
                player: data.sender_id,
                gamePlayer: '5bdaad599a5de86783d335e6',
                quantity: gift.chips,
                remaining: player.chips,
                remark: 'Sent Gift to UID' + data.receiver_id,
                type: 'giftbought'
            });
            if (!transaction) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Transaction not create'
                }
            }
            return {
                status: 'success',
                result: giftPlayers,
                message: 'List of gift transaction.'
            }
        } catch (error) {
            console.log('Error in getGiftSendReceive : ', error);
            return new Error('Error in getGiftSendReceive');
        }
    },
    resizeImage: async function(socket, data) {
        try {
            let image = await Jimp.read(data.url);
            if (!image) {
                return {
                    status: 'fail',
                    result: 'Image not read'
                }
            }
            // console.log('err',err,'image', image);
            if (image) {
                image.cover(parseInt(data.w), parseInt(data.h));
                let imgBuffer = await image.getBuffer(Jimp.MIME_PNG, function(err, buffer) {
                    if (err) {
                        console.log(err);
                        return {
                            status: 'fail',
                            result: err
                        }
                    }
                    // data.set('Content-Type', 'image/png');
                    console.log("get buffer after >>>>>..", buffer);
                    return {
                        status: 'success',
                        result: buffer
                    }
                });
                return imgBuffer;
            } else {
                let img = await Jimp.read(path.join(process.cwd(), 'public/default.png'), async function(err, image) {
                    if (err) {
                        console.log(err);
                        return {
                            status: 'fail',
                            result: err
                        }
                    }
                    image.cover(parseInt(data.w), parseInt(data.h));
                    let imgBuffer = await image.getBuffer(Jimp.MIME_PNG, function(err, buffer) {
                        if (err) {
                            console.log(err);
                            return {
                                status: 'fail',
                                result: err
                            }
                        }
                        // data.set('Content-Type', 'image/png');
                        return {
                            status: 'success',
                            result: buffer
                        }
                    });
                    return imgBuffer;
                });
                return image;
            }
        } catch (error) {
            console.log('Error in resizeImage : ', error);
            return new Error('Error in resizeImage');
        }
    },

    testDataFunctionToGetSymbolsMatrix: async function(socket, data) {
        try {
            let payRatio = 95;
            let desIncmRatio = parseInt(100 - payRatio);
            let bet = 20;
            let lines = 40;
            let mainWinAmount = 100;
            let takenWinAmount = 0;
            let takenSymbol = [];

            // console.log("payRatio : ", payRatio);
            // console.log("desIncmRatio : ", desIncmRatio);
            // console.log("bet : ", bet);
            // console.log("lines : ", lines);
            // console.log("mainWinAmount : ", mainWinAmount);

            // let game = await Sys.Game.Slot.Services.GameService.getOneGame({
            //   _id: data.id,
            // });
            // console.log("Game : ", game);
            // console.log("Game Columns : ", game.column);
            // console.log("Game Rows : ", game.row);

            let symbolReel = await Sys.Game.Slot.Services.SlotGameServices.getSymbol({
                game: data.id,
                symbol_type: 'symbol'
            });
            // console.log("symbolReel", symbolReel);
            symbolReel = await shuffle(symbolReel);
            // console.log("symbolReel : ", symbolReel);

            for (let i = 0; i < symbolReel.length; i++) {
                // console.log("\n");
                // console.log("==================================================================");
                // console.log("Loop of Index", i);
                // console.log("==================================================================");
                let winAmountDiff = takenWinAmount * 100 / mainWinAmount;
                winAmountDiff = winAmountDiff - 100;
                // console.log("takenWinAmount : ", takenWinAmount);
                // console.log("winAmountDiff : ", winAmountDiff);

                if (takenWinAmount < mainWinAmount || winAmountDiff <= desIncmRatio || winAmountDiff >= desIncmRatio) {
                    const payout = await Sys.Game.Slot.Services.SymbolReelServices.getSymbolPayout({
                        game: data.id,
                        symbol: symbolReel[i].id
                    });
                    // console.log("payout is :", payout[0]);

                    if (payout[0].five_time > 0) {
                        // console.log("in five_time");
                        const pay = bet * payout[0].five_time;
                        // console.log("Pay", pay);
                        let extraDiff = pay * 100 / mainWinAmount;
                        extraDiff = extraDiff - 100;
                        // console.log("extraDiff : ", extraDiff);
                        if (extraDiff == 0 || (extraDiff <= desIncmRatio && extraDiff >= 0) || (extraDiff >= (desIncmRatio * -1) && extraDiff <= 0)) {
                            // console.log("in extraDiff if");
                            takenWinAmount = pay;
                            takenSymbol = [];
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].five_time,
                                payout_type: "five_time",
                                pay: pay
                            });
                            // console.log("takenWinAmount : ", takenWinAmount);
                            // console.log("takenSymbol : ", takenSymbol);
                            // console.log("==================================================================");
                            break;
                        } else if (pay < (mainWinAmount - takenWinAmount)) {
                            // console.log("in extraDiff else if");
                            takenWinAmount += pay;
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].five_time,
                                payout_type: "five_time",
                                pay: pay
                            });
                        } else {
                            // console.log("in extraDiff else");
                        }
                    }
                    if (payout[0].four_time > 0) {
                        // console.log("in four_time");
                        const pay = bet * payout[0].four_time;
                        // console.log("Pay", pay);
                        let extraDiff = pay * 100 / mainWinAmount;
                        extraDiff = extraDiff - 100;
                        // console.log("extraDiff : ", extraDiff);
                        if (extraDiff == 0 || (extraDiff <= desIncmRatio && extraDiff >= 0) || (extraDiff >= (desIncmRatio * -1) && extraDiff <= 0)) {
                            // console.log("in extraDiff if");
                            takenWinAmount = pay;
                            takenSymbol = [];
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].four_time,
                                payout_type: "four_time",
                                pay: pay
                            });
                            // console.log("takenWinAmount : ", takenWinAmount);
                            // console.log("takenSymbol : ", takenSymbol);
                            // console.log("==================================================================");
                            break;
                        } else if (pay < (mainWinAmount - takenWinAmount)) {
                            // console.log("in extraDiff else if");
                            takenWinAmount += pay;
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].four_time,
                                payout_type: "four_time",
                                pay: pay
                            });
                        } else {
                            // console.log("in extraDiff else");
                        }
                    }
                    if (payout[0].three_time > 0) {
                        // console.log("in three_time");
                        const pay = bet * payout[0].three_time;
                        // console.log("Pay", pay);
                        let extraDiff = pay * 100 / mainWinAmount;
                        extraDiff = extraDiff - 100;
                        // console.log("extraDiff : ", extraDiff);
                        if (extraDiff == 0 || (extraDiff <= desIncmRatio && extraDiff >= 0) || (extraDiff >= (desIncmRatio * -1) && extraDiff <= 0)) {
                            // console.log("in extraDiff if");
                            takenWinAmount = pay;
                            takenSymbol = [];
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].three_time,
                                payout_type: "three_time",
                                pay: pay
                            });
                            // console.log("takenWinAmount : ", takenWinAmount);
                            // console.log("takenSymbol : ", takenSymbol);
                            // console.log("==================================================================");
                            break;
                        } else if (pay < (mainWinAmount - takenWinAmount)) {
                            // console.log("in extraDiff else if");
                            takenWinAmount += pay;
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].three_time,
                                payout_type: "three_time",
                                pay: pay
                            });
                        } else {
                            // console.log("in extraDiff else");
                        }
                    }
                    if (payout[0].two_time > 0) {
                        // console.log("in two_time");
                        const pay = bet * payout[0].two_time;
                        // console.log("Pay", pay);
                        let extraDiff = pay * 100 / mainWinAmount;
                        extraDiff = extraDiff - 100;
                        // console.log("extraDiff : ", extraDiff);
                        if (extraDiff == 0 || (extraDiff <= desIncmRatio && extraDiff >= 0) || (extraDiff >= (desIncmRatio * -1) && extraDiff <= 0)) {
                            // console.log("in extraDiff if");
                            takenWinAmount = pay;
                            takenSymbol = [];
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].two_time,
                                payout_type: "two_time",
                                pay: pay
                            });
                            // console.log("takenWinAmount : ", takenWinAmount);
                            // console.log("takenSymbol : ", takenSymbol);
                            // console.log("==================================================================");
                            break;
                        } else if (pay < (mainWinAmount - takenWinAmount)) {
                            // console.log("in extraDiff else if");
                            takenWinAmount += pay;
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].two_time,
                                payout_type: "two_time",
                                pay: pay
                            });
                        } else {
                            // console.log("in extraDiff else");
                        }
                    }
                }
                // console.log("takenWinAmount : ", takenWinAmount);
                // console.log("takenSymbol : ", takenSymbol);
                // console.log("takenSymbol length : ", takenSymbol.length);
                // console.log("==================================================================");
            }

            console.log("==================================================================");
            console.log("takenWinAmount : ", takenWinAmount);
            console.log("takenSymbol : ", takenSymbol);
            console.log("takenSymbol length : ", takenSymbol.length);
            console.log("==================================================================");
            // console.log("payouts", payouts);
            return {
                takenWinAmount: takenWinAmount,
                takenSymbol: takenSymbol
            }
        } catch (e) {
            console.log("Catched Error in PlayerController.testDataFunction : ", e);
        }
    },
    testDataFunction: async function(socket, data) {
        try {
            let limit = 40;
            let lines = await Sys.Game.Slot.Services.SlotGameServices.getByLineLimit({
                game: data.id
            }, limit);
            for (let i = 0; i < lines.length; i++) {
                console.log("lines of", i + 1, '\n', lines[i], '\n\n');
            }
            lines = await shuffle(lines);
            console.log("First line data :", lines[0]);

            let reels = await Sys.Game.Slot.Services.SlotGameServices.getReelsData({ game: data.id });
            console.log("reels : ", reels);

            for (let i = 0; i < reels.length; i++) {
                if (reels[i].name == '1') {
                    console.log("This is the first reel :", reels[i].id);
                    break;
                }
            }

            return lines;
        } catch (error) {
            console.log("Catched Error in testDataFunction :", error);
            return new Error(error);
        }
    },


    /**
     * Demo Spin Reel Function With New Payout Logic
     */

    demoSpinReels: async function(socket, data) {
        /*
          device : 2
          id : 5bd6e892e6e06d1a9e593975
          status : playing
          bet : 5bdaa9a99a5de86783d335cb
          lines : 9
          bonus : 0
        */
        try {
            console.log("<---------------- demoSpinReels data ---------------->", data);
            data.bet = '5bdaa9a99a5de86783d335dd';
            let lastRecord = await Sys.Game.Slot.Services.ChipsTransactionService.findLastSpin({ spin: { $ne: '0' } });
            if (lastRecord instanceof Error) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Transaction not found.'
                }
            }
            var lastSpin = lastRecord.length ? lastRecord[0].spin : 0;
            let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ _id: data.playerId });
            if (!player) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No player find.'
                }
            }
            // let bet = data.bet;
            let bet = await Sys.Game.Slot.Services.SlotGameServices.getBetOne({ _id: data.bet });
            if (!bet) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No Bet result found.'
                }
            }
            let gamePlayer = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({ game: data.id, player: player.id, status: 'playing' });
            if (!gamePlayer) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'This player not joined any room.'
                }
            }

            let game = await Sys.Game.Slot.Services.GameServices.getByOneGame({ _id: data.id });
            let remainingChips = player.chips;
            if (data.bonus == 1) {
                await Sys.Game.Slot.Controllers.RoomProcess.demoSpinReels(player, gamePlayer, bet, game, true, 0, lastSpin, data);
            } else {
                await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                    _id: player.id
                }, {
                    chips: parseInt(player.chips) - (parseInt(bet.chips) * parseInt(data.lines))
                });
                player.chips = parseInt(player.chips) - (parseInt(bet.chips) * parseInt(data.lines));

                let spinreels = await Sys.Game.Slot.Controllers.RoomProcess.demoSpinReels(player, gamePlayer, bet, game, false, remainingChips, lastSpin, data);
                return spinreels;
            }
        } catch (error) {
            console.log('Error in demoSpinReels : ', error);
            return new Error('Error in demoSpinReels');
        }
    },

    checkNewLogic: async function(socket, data) {
        try {
            let payRatio = 95;
            let desIncmRatio = parseInt(100 - payRatio);
            let bet = 20;
            // let lines = 40;
            let mainWinAmount = 100;
            let takenWinAmount = 0;
            let takenSymbol = [];

            // console.log("payRatio : ", payRatio);
            // console.log("desIncmRatio : ", desIncmRatio);
            // console.log("bet : ", bet);
            // console.log("lines : ", lines);
            // console.log("mainWinAmount : ", mainWinAmount);

            // let game = await Sys.Game.Slot.Services.GameService.getOneGame({
            //   _id: data.id,
            // });
            // console.log("Game : ", game);
            // console.log("Game Columns : ", game.column);
            // console.log("Game Rows : ", game.row);

            let symbols = await Sys.Game.Slot.Services.SlotGameServices.getSymbol({
                game: data.id,
                symbol_type: 'symbol'
            });
            // console.log("symbols", symbols);
            symbols = await shuffle(symbols);
            // console.log("symbols : ", symbols);

            for (let i = 0; i < symbols.length; i++) {
                // console.log("\n");
                // console.log("==================================================================");
                // console.log("Loop of Index", i);
                // console.log("==================================================================");
                let winAmountDiff = takenWinAmount * 100 / mainWinAmount;
                winAmountDiff = winAmountDiff - 100;
                // console.log("takenWinAmount : ", takenWinAmount);
                // console.log("winAmountDiff : ", winAmountDiff);

                if (takenWinAmount < mainWinAmount || winAmountDiff <= desIncmRatio || winAmountDiff >= desIncmRatio) {
                    const payout = await Sys.Game.Slot.Services.SymbolReelServices.getSymbolPayout({
                        game: data.id,
                        symbol: symbols[i].id
                    });
                    // console.log("payout is :", payout[0]);

                    if (payout[0].five_time > 0) {
                        // console.log("in five_time");
                        const pay = bet * payout[0].five_time;
                        // console.log("Pay", pay);
                        let extraDiff = pay * 100 / mainWinAmount;
                        extraDiff = extraDiff - 100;
                        // console.log("extraDiff : ", extraDiff);
                        if (extraDiff == 0 || (extraDiff <= desIncmRatio && extraDiff >= 0) || (extraDiff >= (desIncmRatio * -1) && extraDiff <= 0)) {
                            // console.log("in extraDiff if");
                            takenWinAmount = pay;
                            takenSymbol = [];
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].five_time,
                                payout_type: "five_time",
                                pay: pay
                            });
                            // console.log("takenWinAmount : ", takenWinAmount);
                            // console.log("takenSymbol : ", takenSymbol);
                            // console.log("==================================================================");
                            break;
                        } else if (pay < (mainWinAmount - takenWinAmount)) {
                            // console.log("in extraDiff else if");
                            takenWinAmount += pay;
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].five_time,
                                payout_type: "five_time",
                                pay: pay
                            });
                        } else {
                            // console.log("in extraDiff else");
                        }
                    }
                    if (payout[0].four_time > 0) {
                        // console.log("in four_time");
                        const pay = bet * payout[0].four_time;
                        // console.log("Pay", pay);
                        let extraDiff = pay * 100 / mainWinAmount;
                        extraDiff = extraDiff - 100;
                        // console.log("extraDiff : ", extraDiff);
                        if (extraDiff == 0 || (extraDiff <= desIncmRatio && extraDiff >= 0) || (extraDiff >= (desIncmRatio * -1) && extraDiff <= 0)) {
                            // console.log("in extraDiff if");
                            takenWinAmount = pay;
                            takenSymbol = [];
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].four_time,
                                payout_type: "four_time",
                                pay: pay
                            });
                            // console.log("takenWinAmount : ", takenWinAmount);
                            // console.log("takenSymbol : ", takenSymbol);
                            // console.log("==================================================================");
                            break;
                        } else if (pay < (mainWinAmount - takenWinAmount)) {
                            // console.log("in extraDiff else if");
                            takenWinAmount += pay;
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].four_time,
                                payout_type: "four_time",
                                pay: pay
                            });
                        } else {
                            // console.log("in extraDiff else");
                        }
                    }
                    if (payout[0].three_time > 0) {
                        // console.log("in three_time");
                        const pay = bet * payout[0].three_time;
                        // console.log("Pay", pay);
                        let extraDiff = pay * 100 / mainWinAmount;
                        extraDiff = extraDiff - 100;
                        // console.log("extraDiff : ", extraDiff);
                        if (extraDiff == 0 || (extraDiff <= desIncmRatio && extraDiff >= 0) || (extraDiff >= (desIncmRatio * -1) && extraDiff <= 0)) {
                            // console.log("in extraDiff if");
                            takenWinAmount = pay;
                            takenSymbol = [];
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].three_time,
                                payout_type: "three_time",
                                pay: pay
                            });
                            // console.log("takenWinAmount : ", takenWinAmount);
                            // console.log("takenSymbol : ", takenSymbol);
                            // console.log("==================================================================");
                            break;
                        } else if (pay < (mainWinAmount - takenWinAmount)) {
                            // console.log("in extraDiff else if");
                            takenWinAmount += pay;
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].three_time,
                                payout_type: "three_time",
                                pay: pay
                            });
                        } else {
                            // console.log("in extraDiff else");
                        }
                    }
                    if (payout[0].two_time > 0) {
                        // console.log("in two_time");
                        const pay = bet * payout[0].two_time;
                        // console.log("Pay", pay);
                        let extraDiff = pay * 100 / mainWinAmount;
                        extraDiff = extraDiff - 100;
                        // console.log("extraDiff : ", extraDiff);
                        if (extraDiff == 0 || (extraDiff <= desIncmRatio && extraDiff >= 0) || (extraDiff >= (desIncmRatio * -1) && extraDiff <= 0)) {
                            // console.log("in extraDiff if");
                            takenWinAmount = pay;
                            takenSymbol = [];
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].two_time,
                                payout_type: "two_time",
                                pay: pay
                            });
                            // console.log("takenWinAmount : ", takenWinAmount);
                            // console.log("takenSymbol : ", takenSymbol);
                            // console.log("==================================================================");
                            break;
                        } else if (pay < (mainWinAmount - takenWinAmount)) {
                            // console.log("in extraDiff else if");
                            takenWinAmount += pay;
                            takenSymbol.push({
                                symbol: payout[0].symbol,
                                payout: payout[0].two_time,
                                payout_type: "two_time",
                                pay: pay
                            });
                        } else {
                            // console.log("in extraDiff else");
                        }
                    }
                }
                // console.log("takenWinAmount : ", takenWinAmount);
                // console.log("takenSymbol : ", takenSymbol);
                // console.log("takenSymbol length : ", takenSymbol.length);
                // console.log("==================================================================");
            }

            console.log("==================================================================");
            console.log("takenWinAmount : ", takenWinAmount);
            console.log("takenSymbol : ", takenSymbol);
            console.log("takenSymbol length : ", takenSymbol.length);
            console.log("==================================================================\n");
            // console.log("payouts", payouts);
            // return {
            //   takenWinAmount: takenWinAmount,
            //   takenSymbol: takenSymbol
            // }

            /**
             * End Here first funciton -------------------------------------------------------
             */



            /**
             * Start Here second funciton ----------------------------------------------------
             */

            let limit = 40;
            let lines = await Sys.Game.Slot.Services.SlotGameServices.getByLineLimit({
                game: data.id
            }, limit);
            // for (let i = 0; i < lines.length; i++) {
            //   console.log("lines of", i+1, '\n', lines[i], '\n\n');
            // }
            lines = await shuffle(lines);

            let requiredLines = takenSymbol.length;

            let requiredLineMatrix = [];
            for (let i = 0; i < requiredLines; i++) {
                console.log("requiredLineMatrix Line Name :", lines[i].name);
                requiredLineMatrix.push(lines[i].matrix);
            }

            let reels = await Sys.Game.Slot.Services.SlotGameServices.getReelsData({ game: data.id });
            // console.log("reels : ", reels);

            for (let i = 0; i < reels.length; i++) {
                if (reels[i].name == '1') {
                    console.log("This is the first reel :", reels[i].id);
                    break;
                }
            }

            let rows = await Sys.Game.Slot.Services.SlotGameServices.getRowsData({ game: data.id });
            // console.log("rows : ", rows);

            symbols = await shuffle(symbols);
            let stringMatrix = {};
            let spinReelMatrix = {
                reel_one: [],
                reel_two: [],
                reel_three: [],
                reel_four: [],
                reel_five: []
            };

            for (let i = 0; i < rows.length; i++) {
                let keyPrefix = i + 1;
                let reelThreeIndex = await getRandomIntInclusive(0, symbols.length - 1);
                let reelFourIndex = await getRandomIntInclusive(0, symbols.length - 1);
                let reelFiveIndex = await getRandomIntInclusive(0, symbols.length - 1);
                stringMatrix['m' + keyPrefix + 3] = symbols[reelThreeIndex].id;
                stringMatrix['m' + keyPrefix + 4] = symbols[reelFourIndex].id;
                stringMatrix['m' + keyPrefix + 5] = symbols[reelFiveIndex].id;
                spinReelMatrix.reel_three.push(symbols[reelThreeIndex].id);
                spinReelMatrix.reel_four.push(symbols[reelFourIndex].id);
                spinReelMatrix.reel_five.push(symbols[reelFiveIndex].id);
            }

            for (let i = 0; i < rows.length; i++) {
                let keyPrefix = i + 1;
                let reelOneIndex = await getRandomIntInclusive(0, symbols.length - 1);
                stringMatrix['m' + keyPrefix + 1] = symbols[reelOneIndex].id;
                spinReelMatrix.reel_one.push(symbols[reelOneIndex].id);
                symbols.splice(reelOneIndex, 1);
            }

            // console.log("symbols : ", symbols);
            for (let i = 0; i < rows.length; i++) {
                let keyPrefix = i + 1;
                let reelTwoIndex = await getRandomIntInclusive(0, symbols.length - 1);
                stringMatrix['m' + keyPrefix + 2] = symbols[reelTwoIndex].id;
                spinReelMatrix.reel_two.push(symbols[reelTwoIndex].id);
            }
            console.log("stringMatrix : ", stringMatrix);
            console.log("spinReelMatrix : ", spinReelMatrix);

            let matrixRowIds = [];
            console.log("==============================================================================");
            for (let i = 0; i < requiredLineMatrix.length; i++) {
                console.log("Line Index :", i);
                console.log("Line data :", requiredLineMatrix[i]);
                let objectKeys = Object.keys(requiredLineMatrix[i]);
                console.log("Matrix Keys :", objectKeys);
                for (let j = 0; j < objectKeys.length; j++) {
                    if (matrixRowIds[i]) {
                        matrixRowIds[i].push(objectKeys[j]);
                    } else {
                        matrixRowIds[i] = [];
                        matrixRowIds[i].push(objectKeys[j]);
                    }
                }
            }
            console.log("==============================================================================\n");
            console.log("matrixRowIds :", matrixRowIds);

            let formatedMatrix = [];
            for (let i = 0; i < requiredLineMatrix.length; i++) {
                for (let j = 0; j < matrixRowIds[i].length; j++) {
                    console.log(i, j, requiredLineMatrix[i][matrixRowIds[i][j]]);
                    let objectKeys = Object.keys(requiredLineMatrix[i][matrixRowIds[i][j]]);
                    console.log("reel Keys :", objectKeys);

                    for (let k = 0; k < objectKeys.length; k++) {
                        for (let l = 0; l < reels.length; l++) {
                            if (objectKeys[k] == reels[l].id) {
                                console.log("Name :", getSequences(reels[l].name));

                                for (let m = 0; m < rows.length; m++) {
                                    if (rows[m].id == matrixRowIds[i][j]) {
                                        // formatedMatrix[getSequences(reels[l].name)] = parseInt(rows[m].name);
                                        if (formatedMatrix[i]) {
                                            formatedMatrix[i][getSequences(reels[l].name)] = parseInt(rows[m].name);
                                        } else {
                                            formatedMatrix[i] = {
                                                reel_one: 0,
                                                reel_two: 0,
                                                reel_three: 0,
                                                reel_four: 0,
                                                reel_five: 0
                                            }
                                            formatedMatrix[i][getSequences(reels[l].name)] = parseInt(rows[m].name);
                                        }

                                        break;
                                    }
                                }

                                break;
                            }
                        }
                    }

                }
            }
            console.log("\nformatedMatrix :", formatedMatrix);

            for (let i = 0; i < formatedMatrix.length; i++) {
                console.log(i, "formatedMatrix.reel_one :", formatedMatrix[i].reel_one);
                spinReelMatrix.reel_one.splice(parseInt(formatedMatrix[i].reel_one - 1), 1, String(takenSymbol[i].symbol));
                stringMatrix['m' + formatedMatrix[i].reel_one + 1] = String(takenSymbol[i].symbol);

                console.log(i, "formatedMatrix.reel_two :", formatedMatrix[i].reel_two);
                spinReelMatrix.reel_two.splice(parseInt(formatedMatrix[i].reel_two - 1), 1, String(takenSymbol[i].symbol));
                stringMatrix['m' + formatedMatrix[i].reel_two + 2] = String(takenSymbol[i].symbol);

                console.log(i, "formatedMatrix.reel_three :", formatedMatrix[i].reel_three);
                spinReelMatrix.reel_three.splice(parseInt(formatedMatrix[i].reel_three - 1), 1, String(takenSymbol[i].symbol));
                stringMatrix['m' + formatedMatrix[i].reel_three + 3] = String(takenSymbol[i].symbol);

                console.log(i, "formatedMatrix.reel_four :", formatedMatrix[i].reel_four);
                spinReelMatrix.reel_four.splice(parseInt(formatedMatrix[i].reel_four - 1), 1, String(takenSymbol[i].symbol));
                stringMatrix['m' + formatedMatrix[i].reel_four + 4] = String(takenSymbol[i].symbol);

                console.log(i, "formatedMatrix.reel_five :", formatedMatrix[i].reel_five);
                spinReelMatrix.reel_five.splice(parseInt(formatedMatrix[i].reel_five - 1), 1, String(takenSymbol[i].symbol));
                stringMatrix['m' + formatedMatrix[i].reel_five + 5] = String(takenSymbol[i].symbol);
            }
            console.log("stringMatrix :", stringMatrix);
            console.log("spinReelMatrix :", spinReelMatrix);


            return lines;
        } catch (e) {
            console.log("Catched Error in checkNewLogic fuction :", e);
            return new Error(e);
        }
    },


    /**
     * Demo Spin Reel Functions With Old Logic and Recursive Functionality
     */
    recSpinReels: async function(socket, data) {
        console.log("calling");
        /*
          device : 2
          id : 5bd6e892e6e06d1a9e593975
          status : playing
          bet : 5bdaa9a99a5de86783d335cb
          lines : 9
          bonus : 0
        */
        try {
            console.log("recSpinReels data ---------------->", data);
            // data.bet = '5bdaa9a99a5de86783d335dd';
            let bet = data.bet;
            /* let bet = await Sys.Game.Slot.Services.SlotGameServices.getBetOne({ _id: data.bet });
            if(!bet){
              return {
                status : 'fail',
                result : null,
                message : 'No Bet result found.'
              }
            } */
            // Send Payout Amounts to further functions
            let payColumns = ['payoutRatio', 'jackpotPlan', 'desiredIncomeRatio', 'totalInward', 'totalOutward', 'totalIncome', 'desiredIncome', 'differenceIncome', 'differenceRatio'];
            let payoutDatas = await Sys.Game.Slot.Services.SettingServices.findOne({}, payColumns);
            console.log("payoutDatas", payoutDatas);
            let someVariable = await Sys.Game.Slot.Controllers.RoomProcess.getPayoutAmount(bet, data.lines);
            let payoutData = {
                lowerPay: 80,
                exactPay: 100,
                upperPay: 105
            };
            data.fixedPayout = someVariable;
            console.log('gameData:', data);
            // data.lowerPay = payoutData.lowerPay;

            /* let lastRecord = await Sys.Game.Slot.Services.ChipsTransactionService.findLastSpin({
              spin: { $ne: '0' }
            });
            if(lastRecord instanceof Error){
              return {
                status : 'fail',
                result : null,
                message : 'Transaction not found.'
              }
            }
            var lastSpin = lastRecord.length ? lastRecord[0].spin : 0; */
            var lastSpin = new ObjectId();
            let player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ _id: data.playerId });
            console.log('playerData:', player);
            if (!player) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No player find.'
                }
            }
            let gamePlayer = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({ game: data.id, player: player.id, status: 'playing' });
            console.log('gamePlayer:', gamePlayer);
            if (!gamePlayer) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'This player not joined any room.'
                }
            }
            /* if (bet.jackpot_eligible) {
              await Sys.Game.Slot.Controllers.RoomProcess.updatedRoomJackpot(gamePlayer.room, gamePlayer.theme);
            } */
            let game = await Sys.Game.Slot.Services.GameServices.getByOneGame({ _id: data.id });
            console.log('game Data:', game);
            console.log('Data:', data);

            let remainingChips = player.chips;
            if (data.bonus == 1) {
                let spinreels = await Sys.Game.Slot.Controllers.RoomProcess.allInOneSpinReels(player, gamePlayer, bet, game, true, 0, lastSpin, data);
                return spinreels;
            } else {
                let newPlayerChips = parseFloat(parseFloat(player.chips) - (parseFloat(bet) * parseInt(data.lines))).toFixed(2);
                newPlayerChips = parseFloat(newPlayerChips);
                await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                    _id: player.id
                }, {
                    chips: newPlayerChips
                });
                player.chips = newPlayerChips;

                // let spinreels = await Sys.Game.Slot.Controllers.RoomProcess.getSpinReelsPayout(player, gamePlayer, bet, game, false, remainingChips, lastSpin, data, allSpinData);
                // let spinreels = await Sys.Game.Slot.Controllers.RoomProcess.recSpinReels(player, gamePlayer, bet, game, false, remainingChips, lastSpin, data, allSpinData);
                let spinreels = await Sys.Game.Slot.Controllers.RoomProcess.allInOneSpinReels(player, gamePlayer, bet, game, false, remainingChips, lastSpin, data);
                let globalPayoutRatio = await Sys.App.Services.SettingsServices.getPayoutSettingData({},['payoutRatio'])
                if(spinreels.result.totalWinning>0){
                    spinreels.result.totalWinning = (spinreels.result.totalWinning * globalPayoutRatio.payoutRatio)/100
                }
                return spinreels;
            }
        } catch (error) {
            console.log('Catched Error in recSpinReels :', error);
            return new Error('Error in recSpinReels');
        }
    },

}

async function shuffle(array) {
    try {
        var ctr = array.length,
            temp, index;

        while (ctr > 0) {
            index = Math.floor(Math.random() * ctr);
            ctr--;
            temp = array[ctr];
            array[ctr] = array[index];
            array[index] = temp;
        }
        return array;
    } catch (error) {
        console.log('Error in shuffle : ', error);
        return new Error('Error in shuffle');
    }
}

async function checkForPayout() {
    try {
        const pay = bet * payout[0].five_time;
        console.log("Pay", pay);
        let extraDiff = pay * 100 / mainWinAmount;
        extraDiff = extraDiff - 100;
        console.log("extraDiff : ", extraDiff);
        if (extraDiff == 0 || (extraDiff <= desIncmRatio && extraDiff >= 0) || (extraDiff >= (desIncmRatio * -1) && extraDiff <= 0)) {
            console.log("in extraDiff if");
            takenWinAmount += pay;
            takenSymbol.push({
                symbol: payout[0].symbol,
                payout: payout[0].five_time,
                payout_type: "five_time",
                pay: pay
            });
        } else if (pay < mainWinAmount) {
            console.log("in extraDiff else if");
            takenWinAmount += pay;
            takenSymbol.push({
                symbol: payout[0].symbol,
                payout: payout[0].five_time,
                payout_type: "five_time",
                pay: pay
            });
        } else {
            console.log("in extraDiff else");
        }
    } catch (e) {
        console.log("Error in checkForPayout function : ", e);
        return new Error(e);
    }
}

async function getRandomIntInclusive(min, max) {
    try {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } catch (error) {
        console.log('Error in getRandomIntInclusive : ', error);
        return new Error('Error in getRandomIntInclusive');
    }
}

function getSequences(data) {
    let name = '';
    switch (data) {
        case '1':
            name = 'reel_one';
            break;
        case '2':
            name = 'reel_two';
            break;
        case '3':
            name = 'reel_three';
            break;
        case '4':
            name = 'reel_four';
            break;
        case '5':
            name = 'reel_five';
            break;
        default:
            name = 'reel_one'; // exceptional case if any error
            break;
    }

    return name;
}