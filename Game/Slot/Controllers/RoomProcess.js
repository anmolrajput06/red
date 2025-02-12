var Sys = require('../../../Boot/Sys');
var moment = require('moment');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {

    joinGame: async function (player, data) {
        try {

            let query = { $and: [{ game: data.game_id }, { status: 'playing' }, { theme: data.theme }] };
            let gamePlayer = await Sys.Game.Slot.Services.GameServices.getByDataGamePlayer(query);
            if (gamePlayer instanceof Error) {
                return { status: 'fail', result: null, message: gamePlayer.message, statusCode: 401 }
            }
            var room = 1;
            // if (gamePlayer.length > 0 && gamePlayer[0].length < 6) {
            if (gamePlayer.length > 0 && gamePlayer[0].total < 6) {
                room = gamePlayer[0].room;

                await Sys.Game.Slot.Controllers.RoomProcess.addGamePlayer(player, room, data);
            } else {
                let query = { $and: [{ game: data.game_id }, { status: 'playing' }, { theme: data.theme }] };

                let getByDataGamePlayer = await Sys.Game.Slot.Services.GameServices.getByDataGamePlayer(query);
                if (getByDataGamePlayer instanceof Error) {
                    return { status: 'fail', result: null, message: getByDataGamePlayer.message, statusCode: 401 }
                }
                if (getByDataGamePlayer.length > 0) {
                    room = getByDataGamePlayer[0].room + 1;
                    let addGame = await Sys.Game.Slot.Controllers.RoomProcess.addGamePlayer(player, room, data);
                    return addGame;
                } else {
                    let addGame = await Sys.Game.Slot.Controllers.RoomProcess.addGamePlayer(player, room, data);
                    return addGame;
                }
            }
        } catch (error) {
            Sys.Log.info('Error in joinGame : ' + error);
            return new Error('Error in joinGame');
        }
    },

    addGamePlayer: async function (player, room, data) {
        try {

            let game_player = await Sys.Game.Slot.Services.GameServices.createGamePlayer({
                game: data.game_id,
                player: data.playerId,
                room: room,
                theme: data.theme,
                status: 'playing'
            });
            if (!game_player) {
                return {
                    status: 'fail',
                    result: null,
                    message: "Room not found",
                    statusCode: 401
                };
            }
            if (game_player) {
                game_player = {
                    "id": game_player.id,
                    "room": game_player.room,
                    "player": game_player.player,
                    "game": game_player.game,
                    "theme": game_player.theme,
                    "status": game_player.status,

                };
            }
            let selected = { "chips": 1, "level": 1, "xp": 1, "day_count": 1, "status": 1, "firstname": 1, "lastname": 1, "mobile": 1, "avatar": 1, "username": 1, "isFb": 1, "rating": 1, "isBot": 1, "device": 1, "device_id": 1, "updatedAt": 1, "createdAt": 1, "id": 1 };
            player = await Sys.Game.Slot.Services.PlayerServices.getOneByData({ _id: game_player.player }, selected);

            if (player instanceof Error) {
                return { status: 'fail', result: null, message: player.message, statusCode: 401 }
            }
            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                _id: player.id
            }, {
                status: "playing"
            });

            // await Sys.Game.Slot.Controllers.RoomProcess.updateJackpot();
            // await Sys.Game.Slot.Controllers.RoomProcess.updateRooms();
            // let jackPotStatus = await Sys.Game.Slot.Controllers.RoomProcess.getRoomJacpotStatus(game_player);
            // game_player.jackPotStatus = jackPotStatus;
            if (player.statistics != null && player.statistics.hasOwnProperty('biggest_win')) {
                player.biggest_win = player.statistics.biggest_win;
            } else {
                player.biggest_win = 0;
            }
            // player.level = checkLevel(player.xp);
            player.level = await Sys.Game.Slot.Controllers.RoomProcess.checkLevel(player.xp);
            // if(game_player != ''){
            //     game_player = game_player.toObject() // <- HERE IS THE CHANGE!
            // }
            game_player.player = player; // It will work now
            // sails.sockets.join(req, 'room-no-' + game_player.room + req.query.theme);
            // sails.sockets.broadcast('room-no-' + game_player.room + req.query.theme, 'NewUserJoined', game_player, req);
            return game_player;
            // return {
            //   status : 'success',
            //   result : game_player,
            //   message : 'Player successfully joined the game.'
            // }
        } catch (error) {
            Sys.Log.info('Error in addGamePlayer : ' + error);
            return new Error('Error in addGamePlayer');
        }
    },

    updateRooms: async function () {
        try {
            let query = { $and: [{ status: 'playing' }, { theme: 'classic' }] };
            let gamePlayerClass = await Sys.Game.Slot.Services.GameServices.getGamePlayerDistance(query);
            let queryWi = { $and: [{ status: 'playing' }, { theme: 'wild' }] };
            let gamePlayerWild = await Sys.Game.Slot.Services.GameServices.getGamePlayerDistance(queryWi);
            let rooms = Sys.Config.Dubai._rooms;
            let jackpot = Sys.Config.Dubai._jackpot
            gamePlayerClass.forEach(function (roomClassic) {
                var present = false;
                rooms.classic.forEach(function (_room) {
                    if (_room.id == roomClassic.room) {
                        present = true;
                    }
                });
                if (!present) {
                    rooms.classic.push({
                        id: roomClassic.room,
                        status: 'updating',
                        theme: 'classic',
                        jackpot: jackpot.start_chips
                    });
                }
            });
            var roomToRemoveClassic = [];
            rooms.classic.forEach(function (roomWild, key) {
                var present = false;
                gamePlayerClass.forEach(function (_room) {
                    if (_room.id == roomWild.room) {
                        present = true;
                    }
                });
                if (!present) {
                    roomToRemoveClassic.push(key);
                }
            });
            for (var i = roomToRemoveClassic.length - 1; i >= 0; i--) {
                rooms.classic.splice(roomToRemoveClassic[i], 1);
            }
            gamePlayerWild.forEach(function (roomWild) {
                var present = false;
                rooms.wild.forEach(function (_room) {
                    if (_room.id == roomWild.room) {
                        present = true;
                    }
                });
                if (!present) {
                    rooms.wild.push({
                        id: roomWild.room,
                        status: 'updating',
                        theme: 'wild',
                        jackpot: jackpot.start_chips
                    });
                }
            });
            var roomToRemoveWild = [];
            rooms.wild.forEach(function (roomWild, key) {
                var present = false;
                gamePlayerWild.forEach(function (_room) {
                    if (_room.id == roomWild.room) {
                        present = true;
                    }
                });
                if (!present) {
                    roomToRemoveWild.push(key);
                }
            });
            for (var i = roomToRemoveWild.length - 1; i >= 0; i--) {
                rooms.wild.splice(roomToRemoveWild[i], 1);
            }

        } catch (error) {
            Sys.Log.info('Error in updateRooms : ' + error);
            return new Error('Error in updateRooms');
        }
    },
    getRoomJacpotStatus: async function (game_player) {
        try {
            var jackpot = 0;
            let rooms = Sys.Config.Dubai._rooms;

            Sys.Config.Dubai._rooms[game_player.theme].forEach(function (_room) {
                console.log("get room data  >>>>>>>>>>", _room);

                if (_room.id == game_player.room) {
                    jackpot = _room.jackpot;
                }
            });

            return jackpot;
        } catch (error) {
            Sys.Log.info('Error in getRoomJacpotStatus : ' + error);
            return new Error('Error in getRoomJacpotStatus');
        }
    },

    updateJackpot: async function () {
        try {
            let jackPot = await Sys.Game.Slot.Services.GameServices.getByDataJackPot({});
            if (jackPot instanceof Error) {
                return { status: 'fail', result: null, message: jackPot.message, statusCode: 401 }
            }
            let jackpot = Sys.Config.Dubai._jackpot
            return jackpot = jackPot[0];
        } catch (error) {
            Sys.Log.info('Error in updateJackpot : ' + error);
            return new Error('Error in updateJackpot');
        }
    },

    joinGameCheck: async function (player, data) {
        try {

            let gamePlayer = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({
                player: player.id,
                game: data.game_id,
                status: 'playing'
            });

            if (gamePlayer instanceof Error) {
                return { status: 'fail', result: null, message: gamePlayer.message, statusCode: 401 }
            }
            if (gamePlayer) {
                await Sys.Game.Slot.Services.GameServices.updateGamePlayer({
                    _id: gamePlayer.id
                }, {
                    status: 'finished'
                });

                let joinGame = await Sys.Game.Slot.Controllers.RoomProcess.joinGame(gamePlayer, data);
                return joinGame;
            } else {
                let joinGame = await Sys.Game.Slot.Controllers.RoomProcess.joinGame(player, data);
                return joinGame;
            }

        } catch (error) {
            Sys.Log.info('Error in joinGameCheck : ' + error);
            return new Error('Error in joinGameCheck');
        }
    },

    joinGameSlot: async function (data) {
        try {
            let gamePlayer = await Sys.Game.Slot.Services.GameServices.createGamePlayer({
                game: parseInt(data.game_id),
                player: data.player_id,
                room: data.room_id,
                theme: data.theme,
                status: 'playing'
            });
            if (!gamePlayer) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'player not Found'
                }
            }

            let getGamePlayer = await Sys.Game.Slot.Services.GameServices.getGamePlayer({ _id: gamePlayer.id });
            if (!getGamePlayer) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'player not Found'
                }
            }
            if (player.statistics != null && player.statistics.hasOwnProperty('biggest_win')) {
                player.biggest_win = player.statistics.biggest_win;
            } else {
                player.biggest_win = 0;
            }
            getGamePlayer.player.level = await Sys.Game.Slot.Controllers.RoomProcess.checkLevel(getGamePlayer.player.xp);
            socket.join(data, 'room-no-' + getGamePlayer.room + getGamePlayer.theme);
            await Sys.Io.of(Sys.Config.Namespace.Slot).to(jackPot.game).emit('NewUserJoined', {
                roomNo: getGamePlayer.room,
                thems: getGamePlayer.them,
                getGamePlayer: getGamePlayer,
                data: data
            });

            return {
                status: 'success',
                result: game_player,
                message: 'Player successfully joined the game.'
            }
        } catch (error) {
            Sys.Log.info('Error in joinGameSlot : ' + error);
            return new Error('Error in joinGameSlot');
        }
    },
    checkLevel: async function (xp) {
        try {
            var level = {
                xp: xp,
                level: 0,
                max_xp: 0,
                min_xp: 0
            };
            let levelData = await Sys.Game.Slot.Services.PlayerServices.getByLevel({});
            levelData.forEach(function (value) {
                if ((xp >= value.minimum && xp <= value.maximum) || (levelData[levelData.length - 1].level == value.level && xp > value.maximum)) {
                    level.id = value.id;
                    level.level = value.level;
                    level.bonus = value.bonus;
                    level.max_xp = value.maximum;
                    level.min_xp = value.minimum;
                }
            })
            return level;
        } catch (error) {
            Sys.Log.info('Error in checkLevel : ' + error);
            return new Error('Error in checkLevel');
        }
    },
    removeBotPlayer: async function (player) {
        try {
            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                _id: player.id
            }, {
                status: null
            });

            player = await Sys.Game.Slot.Services.PlayerServices.getOneByPlayer({ _id: player.id });
            if (!player) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'No player find.'
                }
            } else {
                if (player.botdata != null) {
                    var botData = player.botdata;
                    botData.status = 'deactive';
                    await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                        _id: player.id
                    }, {
                        botdata: botData
                    });
                }
                await Sys.Game.Slot.Services.GameServices.updateGamePlayer({
                    player: player.id,
                    status: 'playing'
                }, {
                    status: 'finished'
                });
                let game_players = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({ player: player.id });
                await Sys.Io.of(Sys.Config.Namespace.Slot).to(game_players.room).emit('UserRemoved', {
                    roomNo: game_players.room,
                    thems: game_players.theme,
                    getGamePlayer: game_players
                });
            }

        } catch (error) {
            Sys.Log.info('Error in removeBotPlayer : ' + error);
            return new Error('Error in removeBotPlayer');
        }
    },
    updatedRoomJackpot: async function (room, theme) {
        try {
            if (theme == 'classic') {
                await Sys.Game.Slot.Controllers.RoomProcess.brodCastRoomJackpotUpdate(Sys.Config.Dubai._rooms.classic, room);
            } else {
                await Sys.Game.Slot.Controllers.RoomProcess.brodCastRoomJackpotUpdate(Sys.Config.Dubai._rooms.wild, room);
            }
        } catch (error) {
            Sys.Log.info('Error in updatedRoomJackpot : ' + error);
            return new Error('Error in updatedRoomJackpot');
        }
    },
    brodCastRoomJackpotUpdate: async function (rooms, room) {
        try {

            rooms.forEach(async function (_room) {
                if (_room.id == room) {
                    _room.jackpot += await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(_jackpot.step_chips / 2, _jackpot.step_chips);
                    if (_room.jackpot < _jackpot.end_chips + await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(_jackpot.margin_chips / 2, _jackpot.margin_chips) && _room.status != 'stoped') {
                        await Sys.Io.of(Sys.Config.Namespace.Slot).to(game_players.room).emit('JackpotUpdated', {
                            chips: _room.jackpot,
                            roomId: _room.id,
                            roomTheme: _room.theme
                        });
                    } else {
                        _room.status = 'stoped'
                    }
                }
            });
        } catch (error) {
            Sys.Log.info('Error in brodCastRoomJackpotUpdate : ' + error);
            return new Error('Error in brodCastRoomJackpotUpdate');
        }
    },
    getRandomIntInclusive: async function (min, max) {
        try {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } catch (error) {
            Sys.Log.info('Error in getRandomIntInclusive : ' + error);
            return new Error('Error in getRandomIntInclusive');
        }
    },
    getCount: async function (symboleText, wildText, lineTempArray, wild) {
        try {
            let count = 1;
            let wildCount = 0;
            let index = 0;
            if (wild) {
                wildCount = 1;
            }
            index++;
            for (index; index < lineTempArray.length; index++) {
                if (symboleText == lineTempArray[index]) {
                    count++;
                } else if (wildText == lineTempArray[index]) {
                    wildCount++;
                    if (wildCount >= 2) {
                        break;
                    }
                    count++;
                } else {
                    break;
                }
            }
            if (wild && count == 1 && wildCount == 2) {
                count = 0;
            }
            return count;
        } catch (error) {
            Sys.Log.info('Error in getCount : ' + error);
            return new Error('Error in getCount');
        }
    },
    searchSymbole: async function (symboleText, wildText = null, lineTempArray) {
        try {
            let symbolPosition = lineTempArray.indexOf(symboleText);
            let wildPosition = lineTempArray.indexOf(wildText);
            if (symbolPosition == 0) {
                return await Sys.Game.Slot.Controllers.RoomProcess.getCount(symboleText, wildText, lineTempArray, false);
            } else if (wildPosition == 0 && symbolPosition == 1) {
                return await Sys.Game.Slot.Controllers.RoomProcess.getCount(symboleText, wildText, lineTempArray, true);
            } else {
                return 0;
            }
        } catch (error) {
            Sys.Log.info('Error in searchSymbole : ' + error);
            return new Error('Error in searchSymbole');
        }
    },
    spinReels: async function (player, gamePlayer, bet, game, free, remainingChips, lastSpin, data) {
        try {
            var matrix = {};
            var reels = {
                reel_one: [],
                reel_two: [],
                reel_three: [],
                reel_four: [],
                reel_five: []
            };
            let symbolReels = await Sys.Game.Slot.Services.SymbolReelServices.getBySymbolReels({ game: data.id });
            symbolReels = JSON.stringify(symbolReels);
            symbolReels = JSON.parse(symbolReels);
            for (var s = 0; s < symbolReels.length; s++) {
                let symbol = await Sys.Game.Slot.Services.SymbolServices.getOneSymbol({ _id: symbolReels[s].symbol })
                let reel = await Sys.Game.Slot.Services.ReelServices.getOneReel({ _id: symbolReels[s].reel })

                symbolReels[s].symbol = symbol;
                symbolReels[s].reel = reel;
            }
            var newreels = {};
            symbolReels.forEach(async function (symbolReel) {
                // console.log("reels data <<===============>>",symbolReel);
                if (newreels[symbolReel.reel]) {
                    await Sys.Game.Slot.Controllers.RoomProcess.addSymbolToReel(newreels[symbolReel.reel], symbolReel.symbol, symbolReel.count);
                } else {
                    newreels[symbolReel.reel] = []
                    await Sys.Game.Slot.Controllers.RoomProcess.addSymbolToReel(newreels[symbolReel.reel], symbolReel.symbol, symbolReel.count);
                }
            });
            var tempReal = [];
            for (const key in newreels) {
                if (newreels.hasOwnProperty(key)) {
                    await Sys.Game.Slot.Controllers.RoomProcess.shuffle(newreels[key]);
                }
            }
            for (const key in newreels) {
                if (newreels.hasOwnProperty(key)) {
                    const element = newreels[key];
                    tempReal.push(element)
                }
            }

            combinations = [];
            let index = {
                reel_one: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[0].length),
                reel_two: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[1].length),
                reel_three: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[2].length),
                reel_four: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, data.id != '5bd9b169afdd62126b1b848f' ? tempReal[3].length : null),
                reel_five: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, data.id != '5bd9b169afdd62126b1b848f' ? tempReal[4].length : null),
            }

            for (let i = 0; i < 4; i++) {
                if (index.reel_one == tempReal[0].length) {
                    index.reel_one = 0
                }
                if (index.reel_two == tempReal[1].length) {
                    index.reel_two = 0
                }
                if (index.reel_three == tempReal[2].length) {
                    index.reel_three = 0
                }
                if (data.id != '5bd9b169afdd62126b1b848f' && index.reel_four == tempReal[3].length) {
                    index.reel_four = 0
                }
                if (data.id != '5bd9b169afdd62126b1b848f' && index.reel_five == tempReal[4].length) {
                    index.reel_five = 0
                }

                combinations.push({
                    reel_one: tempReal[0][index.reel_one].id,
                    reel_two: tempReal[1][index.reel_two].id,
                    reel_three: tempReal[2][index.reel_three].id,
                    reel_four: data.id != '5bd9b169afdd62126b1b848f' ? tempReal[3][index.reel_four].id : '',
                    reel_five: data.id != '5bd9b169afdd62126b1b848f' ? tempReal[4][index.reel_five].id : '',
                })
                index.reel_one++
                index.reel_two++
                index.reel_three++
                if (index.reel_four != null) {
                    index.reel_four++;
                }
                if (index.reel_five != null) {
                    index.reel_five++;
                }
            }
            combinations.forEach(function (combination, key) {
                var keyPrefix = key + 1;
                matrix['m' + keyPrefix + 1] = combination.reel_one;
                matrix['m' + keyPrefix + 2] = combination.reel_two;
                matrix['m' + keyPrefix + 3] = combination.reel_three;
                matrix['m' + keyPrefix + 4] = combination.reel_four;
                matrix['m' + keyPrefix + 5] = combination.reel_five;
                reels.reel_one.push(combination.reel_one);
                reels.reel_two.push(combination.reel_two);
                reels.reel_three.push(combination.reel_three);
                reels.reel_four.push((combination.reel_four) ? combination.reel_four : '');
                reels.reel_five.push((combination.reel_five) ? combination.reel_five : '');
            });
            let lines = await Sys.Game.Slot.Services.SlotGameServices.getByLine({ game: data.id });
            if (lines instanceof Error) {
                return { status: 'fail', result: null, message: lines.message, statusCode: 401 }
            }
            let symbols = await Sys.Game.Slot.Services.SlotGameServices.getSymbol({ symbol_type: 'symbol', game: data.id });
            if (symbols instanceof Error) {
                return { status: 'fail', result: null, message: symbols.message, statusCode: 401 }
            }
            let wild = await Sys.Game.Slot.Services.SlotGameServices.getOneSymbol({ symbol_type: 'wild', game: data.id });
            if (wild instanceof Error) {
                return { status: 'fail', result: null, message: wild.message, statusCode: 401 }
            }
            let searchResult = [];
            let linesMatrix = [];
            let history = [];
            lines = JSON.stringify(lines);
            lines = JSON.parse(lines);
            lines.forEach(function (line) {
                let remark = 'bet on game1';
                if (data.bonus == 1) {
                    remark = 'bonus spin'
                }
                if (!free) {
                    remainingChips = remainingChips - bet.chips
                }

                history.push({
                    player: player.id,
                    gamePlayer: gamePlayer.id,
                    quantity: free ? 0 : bet.chips,
                    remaining: remainingChips,
                    remark: remark,
                    type: 'bet',
                    line: line.id,
                    spin: parseInt(lastSpin) + 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

                var row = [];
                for (let row_id in line.matrix) {
                    for (let column_id in line.matrix[row_id]) {
                        if (line.matrix[row_id][column_id]) {
                            row.push({ row: row_id, col: column_id })
                        }
                    }
                }
                row.sort(function (a, b) { return (a.col > b.col) ? 1 : ((b.col > a.col) ? -1 : 0); });
                var rowData = [];
                game.rows.forEach(function (row) {
                    rowData.push(row.id)
                })
                var cols = [];
                game.reels.forEach(function (reel) {
                    cols.push(reel.id)
                })
                row.forEach(function (cell) {
                    var rowIndex = rowData.indexOf(cell.row) + 1;
                    var colIndex = cols.indexOf(cell.col) + 1;
                    line[`m${rowIndex}${colIndex}`] = true;
                })
                var lineTemp = '';
                var lineTempArray = []
                for (var j = 1; j < 6; j++) {
                    for (var i = 1; i < 5; i++) {
                        var key = 'm' + i + j;
                        if (line[key] == true) {
                            lineTemp += String("ADGKZ" + String(matrix[key])).slice(-5);
                            lineTempArray.push(String("ADGKZ" + String(matrix[key])).slice(-5))
                        }
                    }
                }

                linesMatrix.push(lineTemp);
                var symbolCounts = [];

                if (wild) {
                    var wildSearchString = String("ADGKZ" + String(wild.id)).slice(-5);
                }
                // This code is for left to right combination for big slots and reverted code for small slot
                symbols.forEach(async function (symbol) {
                    var searchString = String("ADGKZ" + String(symbol.id)).slice(-5);
                    if (data.id == '5bd9b169afdd62126b1b848f') {
                        var count = (lineTemp.match(new RegExp(searchString, "g")) || []).length;
                        var symbolCount = 0;
                        switch (count) {
                            case 3:
                                symbolCount = 3;
                                break
                            case 2:
                                symbolCount = 2;
                                break
                            case 1:
                                symbolCount = 1;
                        }
                    } else {

                        var symbolCount = await Sys.Game.Slot.Controllers.RoomProcess.searchSymbole(searchString, wild ? wildSearchString : null, lineTempArray);

                    }

                    if (symbolCount == 1) {
                        if (data.id == '5bd9b169afdd62126b1b848f') {
                            symbolCount = 1;
                        } else {
                            // symbolCount = symbolCount
                            symbolCount = 0;
                        }
                    }
                    if (symbolCount > 0) {
                        symbolCounts.push({ symbol_id: symbol.id, count: symbolCount });
                    }
                });
                searchResult.push({ line_id: line.id, symbolCounts: symbolCounts });
            });

            var result = {
                matrix: reels,
                searchResult: searchResult
            };
            //start 
            let addWinning = await Sys.Game.Slot.Controllers.RoomProcess.addWinningChips(bet, linesMatrix, player, gamePlayer, result, history, lastSpin, data);

            return addWinning;

            // }
        } catch (error) {
            console.log('Error in spinReels : ', error);
            return new Error('Error in spinReels');
        }
    },

    addWinningChips: async function (bet, lines, player, gamePlayer, result, history, lastSpin, data) {
        try {
            console.log("yessss");
            let payouts = await Sys.Game.Slot.Services.SymbolReelServices.getSymbolPayout({ game: data.id });
            if (payouts instanceof Error) {
                return { status: 'fail', result: null, message: payouts.message, statusCode: 401 }
            }
            // var line_bet = bet;
            var line_bet = bet.chips;
            var totalWinning = 0;
            // console.log("payouts : ", payouts);

            let linesWithZeroWinning = []; // index of result.searchResult

            result.searchResult.forEach(function (line, lineIndex) {
                let lineTotal = 0;
                if (line.symbolCounts.length) {
                    line.symbolCounts.forEach(function (symbol) {
                        payouts.forEach(function (payout) {
                            if (symbol.symbol_id == payout.symbol) {

                                switch (symbol.count) {
                                    case 5:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.five_time));
                                        break;
                                    case 4:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.four_time));
                                        break;
                                    case 3:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.three_time));
                                        break;
                                    case 2:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.two_time));
                                        break;
                                    case 1:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.one_time));
                                        break;
                                }
                            }
                        })
                    });
                }

                totalWinning = totalWinning + lineTotal;
                if (lineTotal == 0) {
                    linesWithZeroWinning.push(lineIndex)
                }
                player.chips = parseInt(player.chips) + parseFloat(lineTotal);
                console.log("maulikBet.chips", bet.chips);
                history.push({
                    player: player.id,
                    gamePlayer: gamePlayer.id,
                    quantity: lineTotal,
                    remaining: player.chips,
                    remark: 'winning in game',
                    type: 'win',
                    line: line.line_id,
                    spin: parseInt(lastSpin) + 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            });

            for (let i = result.searchResult.length - 1; i >= 0; i--) {
                if (linesWithZeroWinning.indexOf(i) != -1) {
                    result.searchResult.splice(i, 1)
                }
            }
            result.totalWinning = totalWinning;

            var biggestWin = 0;
            history.forEach(function (chipData) {
                if (chipData.type == 'win') {
                    biggestWin = (biggestWin < chipData.quantity) ? chipData.quantity : biggestWin;
                }
            });
            if (player.statistics != null && player.statistics.hasOwnProperty('biggest_win')) {
                if (player.statistics.biggest_win < biggestWin) {
                    player.statistics.biggest_win = biggestWin;
                }
            } else {
                player.statistics = {};
                player.statistics.biggest_win = biggestWin;
            }
            var xp = (totalWinning) ? player.xp + 50 : player.xp + 10;
            let payout = await Sys.Game.Slot.Controllers.RoomProcess.checkForPayoutName(data, bet, totalWinning);
            xp = (payout) ? xp + 50 : xp;
            var level = await Sys.Game.Slot.Controllers.RoomProcess.checkLevel(xp);
            // console.log("room process addWinning --------------->>>",history)
            for (var h = 0; h < history.length; h++) {
                console.log("maulikHistory", history[h].type);
                // if(history[h].type == 'win'){
                let transactions = await Sys.Game.Slot.Services.ChipsTransactionService.create({
                    player: history[h].player,
                    gamePlayer: history[h].gamePlayer,
                    quantity: history[h].quantity,
                    remaining: history[h].remaining,
                    remark: history[h].remark,
                    type: history[h].type,
                    line: history[h].line,
                    spin: history[h].spin,
                });
                // }
            }
            let transaction = {
                player: player.id,
                gamePlayer: gamePlayer.id,
                quantity: totalWinning,
                remaining: player.chips,
                remark: (payout) ? 'winning in game :' + payout.name : 'winning in game',
                type: 'win',
            };
            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                _id: player.id
            }, {
                xp: xp,
                level: level.level,
                chips: player.chips,
                statistics: player.statistics
            });
            result.level = level;
            result.payout_name = (payout) ? payout.name : null;
            transaction.level = level;
            let resultSearch = await Sys.Game.Slot.Controllers.RoomProcess.searchFreeSpin(data, lines, result);
            result = resultSearch;
            let game_player = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({ _id: transaction.gamePlayer });
            transaction.free_spin = result.free_spin;
            if (payout && bet) {
                if (bet.jackpot_eligible && payout.jackpot_eligible) {
                    await Sys.Game.Slot.Controllers.RoomProcess.checkForRoomJackpotDistribution(game_player, player);
                }
            }
            await Sys.Io.of(Sys.Config.Namespace.Slot).to(data.room).emit('PlayerWin', {
                roomNo: data.room,
                thems: game_player.theme,
                transaction: transaction,
                data: data
            });
            if (data) {
                return {
                    status: 'success',
                    message: 'Spin success.',
                    result: result
                }
            } else {
                if (data.hasOwnProperty('spinAgain')) {

                    return data.spinAgain;
                }
                // botSpinReels(game_player);
            }
            // });
            // console.log("searchSpin >>>>>>><<<<<<<<",searchSpin);
            // return searchSpin;
            // });

        } catch (error) {
            Sys.Log.info('Error in addWinningChips : ' + error);
            return new Error('Error in addWinningChips');
        }
    },
    checkForRoomJackpotDistribution: async function (game_player, player) {
        try {
            Sys.Config.Dubai._rooms[game_player.theme].forEach(async function (_room) {
                if (_room.id == game_player.room && _room.status == 'stoped') {
                    player.chips = parseInt(player.chips) + parseInt(_room.jackpot);
                    await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                        _id: player.id
                    }, {
                        chips: player.chips
                    });

                    let transaction = await Sys.Game.Slot.Services.ChipsTransactionService.create({
                        player: player.id,
                        gamePlayer: game_player.id,
                        quantity: parseInt(_room.jackpot),
                        remaining: parseInt(player.chips),
                        remark: 'jackpot in game',
                        type: 'win'
                    });
                    _room.jackpot = _jackpot.start_chips;
                    _room.status = 'updating';
                    if (transaction instanceof Error) {
                        return {
                            jackpot: _jackpot.start_chips,
                            status: 'updating'
                        }
                    }
                    await Sys.Io.of(Sys.Config.Namespace.Slot).to(_room.id).emit('Jackpot', {
                        roomId: _room.id,
                        thems: _room.theme,
                        transaction: transaction
                    });
                    _room.jackpot = _jackpot.start_chips;
                    _room.status = 'updating';
                }
            });
        } catch (error) {
            Sys.Log.info('Error in checkForRoomJackpotDistribution : ' + error);
            return new Error('Error in checkForRoomJackpotDistribution');
        }
    },
    checkForPayoutName: async function (data, bet, totalWinning) {
        try {

            // var totalBet = bet.chips * data.lines;
            let totalBet = bet * data.lines;
            var xTimesWinning = Math.trunc(totalWinning / totalBet);
            let payouts = await Sys.Game.Slot.Services.SymbolReelServices.getpayoutName({ game: data.id })
            console.log("payouts", payouts)
            var finalPayout = null;
            payouts.forEach(function (payout) {
                if (xTimesWinning >= payout.minimum && xTimesWinning < payout.maximum) {
                    if (finalPayout == null) {
                        finalPayout = payout;
                    }
                }
            })
            if (xTimesWinning > payouts[payouts.length - 1].maximum) {
                finalPayout = payouts[payouts.length - 1];
            }
            if (xTimesWinning < payouts[0].minimum) {
                finalPayout = payouts[0];
            }
            return finalPayout;
        } catch (error) {
            Sys.Log.info('Error in checkForPayoutName : ' + error);
            return new Error('Error in checkForPayoutName');
        }
    },
    addSymbolToReel: async function (reel, symbol, count) {
        try {
            for (var i = 0; i < count; i++) {
                reel.push({ id: symbol.id, text: symbol.symbol });
            }
        } catch (error) {
            console.log('Error in addSymbolToReel : ', error);
            return new Error('Error in addSymbolToReel');
        }
    },
    searchFreeSpin: async function (data, lines, result) {
        try {
            console.log("resultForSpin", result)
            let bonus = await Sys.Game.Slot.Services.SlotGameServices.getOneSymbol({ symbol_type: 'bonus', game: data.id });

            if (bonus instanceof Error) {
                return { status: 'fail', result: null, message: bonus.message, statusCode: 401 }
            }
            if (!bonus) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Error fetching bonus symbol data in "searchFreeSpin'
                }
            }
            if (bonus) {
                var bonusCount = 0;
                var tempbonusCount = 0;
                var line_id;
                var bonusSearchString = String("ADGKZ" + String(bonus.id)).slice(-5);
                lines.forEach(function (line, lineIndex) {
                    tempbonusCount = (line.match(new RegExp(bonusSearchString, "g")) || []).length;
                    if (tempbonusCount >= bonusCount) {
                        bonusCount = tempbonusCount;
                        line_id = lineIndex;
                    }
                });
                let payout = await Sys.Game.Slot.Services.SymbolReelServices.getSymbolPayoutOne({ symbol: bonus.id });
                if (payout instanceof Error) {
                    return { status: 'fail', result: null, message: payout.message, statusCode: 401 }
                }
                if (!payout) {
                    return {
                        status: 'fail',
                        result: null,
                        message: 'Error fetching payout data of bonus symbol in "searchFreeSpin'
                    }
                }
                switch (bonusCount) {
                    case 3:
                        result.free_spin = parseInt(payout.three_time);
                        break;
                    case 4:
                        result.free_spin = parseInt(payout.four_time);
                        break;
                    case 5:
                        result.free_spin = parseInt(payout.five_time);
                        break;
                    default:
                        result.free_spin = parseInt(0);
                }
                if (result.free_spin != 0) {
                    let limit = data.lines;
                    let lineData = await Sys.Game.Slot.Services.SlotGameServices.getByLineLimit({ game: data.id }, limit);
                    if (lineData instanceof Error) {
                        return { status: 'fail', result: null, message: lineData.message, statusCode: 401 }
                    }
                    if (!lineData) {
                        return {
                            status: 'fail',
                            result: null,
                            message: 'Error fetching lines data in "searchFreeSpin'
                        }
                    }

                    var lineId = lineData[line_id].id;
                    var symbolCounts = [];
                    symbolCounts.push({ symbol_id: bonus.id, count: bonusCount });
                    result.searchResult.push({ line_id: lineId, symbolCounts: symbolCounts });
                    return result;
                } else {
                    return result;
                }
            } else {
                result.free_spin = parseInt(0);
                return result;
            }
        } catch (error) {
            console.log('Error in searchFreeSpin : ', error);
            return new Error('Error in searchFreeSpin');
        }
    },
    shuffle: async function (array) {
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
            Sys.Log.info('Error in shuffle : ' + error);
            return new Error('Error in shuffle');
        }
    },
    searchFriend: async function (from, to) {
        try {
            let friends = await Sys.Game.Slot.Services.FriendService.getByData({ request_from: from, request_to: to });
            if (friends == 0) {
                return {
                    status: 'fail',
                    result: null,
                    message: 'Friend not found'
                }
            } else {
                return friends;
            }
        } catch (error) {
            Sys.Log.info('Error in searchFriend : ' + error);
            return new Error('Error in searchFriend');
        }
    },
    removeFriend: async function (data) {
        try {
            let friends = await Sys.Game.Slot.Services.FriendService.friendDelete(data);
            return {
                status: 'success',
                result: 'ok',
                message: 'Friend removed',
            }
        } catch (error) {
            Sys.Log.info('Error in removeFriend : ' + error);
            return new Error('Error in removeFriend');
        }
    },

    getMessages: async function (index) {
        try {
            if (index == players.length) {
                await Sys.Game.Slot.Controllers.RoomProcess.getMessagesCount(0);
            } else {
                let message = await Sys.Game.Slot.Services.FriendService.getByOnePokerRoom({ sender: players[index].id, reciever: req.params.user_id, limit: 1 });
                if (!message) {
                    return {
                        status: 'fail',
                        result: null,
                        message: 'Message not found.'
                    }
                } else {
                    players[index].message = message
                    index++
                    await Sys.Game.Slot.Controllers.RoomProcess.getMessages(index);
                }
            }
        } catch (error) {
            Sys.Log.info('Error in getMessages : ' + error);
            return new Error('Error in getMessages');
        }
    },

    getMessagesCount: async function (index) {
        try {
            if (index == players.length) {
                players.sort(function (a, b) {
                    if (a.message) {
                        if (b.message) {
                            var d = new Date(a.message.createdAt);
                            var e = new Date(b.message.createdAt);
                            if (d.getTime() > e.getTime()) {
                                return -1;
                            } else {
                                return 1
                            }
                        } else {
                            return 0;
                        }
                    } else {
                        return 1;
                    }
                })
                for (let i = 0; i < players.length; i++) {
                    delete players[i].game_players;
                    //  delete players[i].message;
                }

                return {
                    status: 'success',
                    result: 'ok',
                    message: 'Friend delete successfully.',
                }
            } else {
                let count = await Sys.Game.Slot.Services.FriendService.getMessageCount({
                    isRead: false,
                    sender: players[index].id,
                    reciever: data.userId
                });
                if (!count) {
                    return {
                        status: 'fail',
                        result: null,
                        message: 'Friend not found'
                    }
                } else {
                    players[index].messageCount = count
                    if (players[index].game_players.length > 0) {
                        if (players[index].game_players[0].game == '2') {
                            players[index].roomId = 0;
                        } else {
                            players[index].roomId = players[index].game_players[0].id;
                            players[index].theme = players[index].game_players[0].theme;
                        }
                    } else {
                        players[index].roomId = 0;
                    }

                    let room = await Sys.Game.Slot.Services.FriendService.getByPokerRoom({ players: { $regex: '.*' + players[index].id + '.*' } })
                    if (room.length > 0) {
                        players[index].tableId = room[0].id
                    } else {
                        players[index].tableId = 0
                    }
                    index++
                    await Sys.Game.Slot.Controllers.RoomProcess.getMessagesCount(index);
                }
            }
        } catch (error) {
            Sys.Log.info('Error in getMessagesCount : ' + error);
            return new Error('Error in getMessagesCount');
        }
    },

    generateSearchResult: async function (gameId) {
        try {
            let symbolReel = await Sys.App.Services.SymbolReelServices.getSymbolReelSymbol({ game: gameId });
            var symboleSearchCount = [];
            var symbolWiseReel = [];
            var wildWiseReel = [];
            var rowData = [];

            for (var i = 0; i < symbolReel.length; i++) {

                if (symbolReel[i].symbol.symbol_type == 'wild') {
                    if (wildWiseReel[symbolReel[i].symbol.id]) {
                        wildWiseReel[symbolReel[i].symbol.id].push(symbolReel[i]);
                    } else {
                        wildWiseReel[symbolReel[i].symbol.id] = [];
                        wildWiseReel[symbolReel[i].symbol.id].push(symbolReel[i]);
                    }
                } else {
                    if (symbolWiseReel[symbolReel[i].symbol.id]) {
                        symbolWiseReel[symbolReel[i].symbol.id].push(symbolReel[i]);
                    } else {
                        symbolWiseReel[symbolReel[i].symbol.id] = [];
                        symbolWiseReel[symbolReel[i].symbol.id].push(symbolReel[i]);
                    }
                }
            }
            var oneTotal = 0;
            var twoTotal = 0;
            var threeTotal = 0;
            var fourTotal = 0;
            var fiveTotal = 0;
            var totalCombo = 0;
            symbolReel.forEach(function (reel) {
                if (reel.name == '1') { oneTotal += reel.count; }
                if (reel.name == '2') { twoTotal += reel.count; }
                if (reel.name == '3') { threeTotal += reel.count; }
                if (reel.name == '4') { fourTotal += reel.count; }
                if (reel.name == '5') { fiveTotal += reel.count; }
            });
            totalCombo = oneTotal * twoTotal * threeTotal * fourTotal * fiveTotal;

            let symbols = await Sys.App.Services.SymbolServices.getSymbol({ game: gameId, symbol_type: ['symbol', 'bonus'] });

            symbols.forEach(function (symbol) {

                symboleSearchCount[symbol.id] = {
                    symbol_text: symbol.symbol,
                    one_time: 0,
                    two_time: 0,
                    two_time_wild: 0,
                    three_time: 0,
                    three_time_wild: 0,
                    four_time: 0,
                    four_time_wild: 0,
                    five_time: 0,
                    five_time_wild: 0,
                    symbol: symbol.id,
                    game: gameId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            // console.log("symbolWiseReel.length ------->>>",symbolWiseReel.length);
            symbolWiseReel.forEach(function (symbol, index) {
                // console.log("symbol data -------------->",symbol);
                var oneTime = 1;
                var twoTime = 1;
                var threeTime = 1;
                var fourTime = 1;
                var fiveTime = 1;
                var reelOne = 0;
                var reelTwo = 0;
                var reelThree = 0;

                for (var j = 0; j < symbol.length; j++) {

                    if (gameId == '2') {
                        reelOne = (symbol[j].name == '1') ? symbol[j].count : reelOne;
                        reelTwo = (symbol[j].name == '2') ? symbol[j].count : reelTwo;
                        reelThree = (symbol[j].name == '3') ? symbol[j].count : reelThree;

                        threeTime = threeTime * symbol[j].count;
                    } else {

                        switch (symbol[j].name) {
                            case '3':
                                twoTime = twoTime * (threeTotal - symbol[j].count);
                                threeTime = threeTime * symbol[j].count;
                                fourTime = fourTime * symbol[j].count;
                                break;

                            case '4':
                                twoTime = twoTime * (fourTotal - symbol[j].count);
                                threeTime = threeTime * (fourTotal - symbol[j].count);
                                fourTime = fourTime * symbol[j].count;
                                break;

                            case '5':
                                twoTime = twoTime * (fiveTotal - symbol[j].count);
                                threeTime = threeTime * (fiveTotal - symbol[j].count);
                                fourTime = fourTime * (fiveTotal - symbol[j].count);
                                break;

                            default:
                                twoTime = twoTime * symbol[j].count;
                                threeTime = threeTime * symbol[j].count;
                                fourTime = fourTime * symbol[j].count;
                                break;
                        }

                        fiveTime = fiveTime * symbol[j].count;
                    }
                }

                if (gameId == '2') {
                    // B3*(C8-C3)*(D8-D3)+(B8-B3)*C3*(D8-D3)+(B8-B3)*(C8-C3)*D3
                    oneTime = (reelOne * (twoTotal - reelTwo) * (threeTotal - reelThree)) + ((oneTotal - reelOne) * reelTwo * (threeTotal - reelThree)) + ((oneTotal - reelOne) * (twoTotal - reelTwo) * reelThree);

                    // B3*C3*(D8-D3)+B3*(C8-C3)*D3+(B8-B3)*C3*D3
                    twoTime = (reelOne * reelTwo * (threeTotal - reelThree)) + (reelOne * (twoTotal - reelTwo) * reelThree) + ((oneTotal - reelOne) * reelTwo * reelThree);
                }

                if (gameId == '2') { symboleSearchCount[index].one_time = oneTime; }
                symboleSearchCount[index].two_time = twoTime;
                symboleSearchCount[index].three_time = threeTime;
                if (gameId != '2') { symboleSearchCount[index].four_time = fourTime; }
                if (gameId != '2') { symboleSearchCount[index].five_time = fiveTime; }
            });


            if (wildWiseReel != 0) {
                symbolWiseReel.forEach(function (symbol, index) {
                    wildWiseReel.forEach(function (wild) {
                        for (var l = 0; l < wild.length; l++) {
                            var wildCard = [];
                            for (var m = 0; m < symbol.length; m++) {
                                if (typeof wildCard[index] === 'undefined') {
                                    wildCard[index] = {
                                        two: 1,
                                        three: 1,
                                        four: 1,
                                        five: 1,
                                    };
                                }

                                wildCard[index].five = wildCard[index].five * ((wild[l].reel == symbol[m].reel) ? wild[l].count : symbol[m].count); //4x1w

                                if (l == wild.length - 1) {
                                    wildCard[index].two = (m == 0) ? (wildCard[index].two - 1) : wildCard[index].two;
                                    wildCard[index].three = (m == 0) ? (wildCard[index].three - 1) : wildCard[index].three;
                                    wildCard[index].four = (m == 0) ? (wildCard[index].four - 1) : wildCard[index].four;
                                    continue;
                                }
                                if (symbol[m].name == '5') {
                                    wildCard[index].four = wildCard[index].four * (fiveTotal - symbol[m].count - wild[wild.length - 1].count);
                                } else {
                                    wildCard[index].four = wildCard[index].four * ((wild[l].reel == symbol[m].reel) ? wild[l].count : symbol[m].count);
                                } // 3x1w

                                if (l == (wild.length - 2)) {
                                    wildCard[index].two = (m == 0) ? (wildCard[index].two - 1) : wildCard[index].two;
                                    wildCard[index].three = (m == 0) ? (wildCard[index].three - 1) : wildCard[index].three;
                                    continue;
                                }
                                if (symbol[m].name == '5') {
                                    wildCard[index].three = wildCard[index].three * (fiveTotal - symbol[m].count - wild[wild.length - 1].count);
                                } else if (symbol[m].name == '4') {
                                    wildCard[index].three = wildCard[index].three * (fourTotal - symbol[m].count - wild[wild.length - 2].count);
                                } else {
                                    wildCard[index].three = wildCard[index].three * ((wild[l].reel == symbol[m].reel) ? wild[l].count : symbol[m].count);
                                } // 2x1w

                                if (l == (wild.length - 3)) {
                                    wildCard[index].two = (m == 0) ? (wildCard[index].two - 1) : wildCard[index].two;
                                    continue;
                                }
                                if (symbol[m].name == '5') {
                                    wildCard[index].two = wildCard[index].two * (fiveTotal - symbol[m].count - wild[wild.length - 1].count);
                                } else if (symbol[m].name == '4') {
                                    wildCard[index].two = wildCard[index].two * (fourTotal - symbol[m].count - wild[wild.length - 2].count);
                                } else if (symbol[m].name == '3') {
                                    wildCard[index].two = wildCard[index].two * (threeTotal - symbol[m].count - wild[wild.length - 3].count);
                                } else {
                                    wildCard[index].two = wildCard[index].two * ((wild[l].reel == symbol[m].reel) ? wild[l].count : symbol[m].count);
                                } // 1x1w
                            }

                            // two time wild count
                            symboleSearchCount[index].two_time_wild = symboleSearchCount[index].two_time_wild + wildCard.reduce((a, b) => a + b.two, 0);

                            // three time wild count
                            symboleSearchCount[index].three_time_wild = symboleSearchCount[index].three_time_wild + wildCard.reduce((a, b) => a + b.three, 0);

                            // four time wild count
                            symboleSearchCount[index].four_time_wild = symboleSearchCount[index].four_time_wild + wildCard.reduce((a, b) => a + b.four, 0);

                            // five time wild count
                            symboleSearchCount[index].five_time_wild = symboleSearchCount[index].five_time_wild + wildCard.reduce((a, b) => a + b.five, 0);
                        }
                    });
                });

            }

            let data = [];
            for (let key in symboleSearchCount) {
                data.push(symboleSearchCount[key]);
            }

            let getSearchData = await Sys.App.Services.SymbolSearchServices.getBySymbolSearch({ game: gameId });
            for (var w = 0; w < getSearchData.length; w++) {
                await Sys.App.Services.SymbolSearchServices.deleteSymbolSearch(getSearchData[w].id)
            }
            for (var s = 0; s < data.length; s++) {
                let search = await Sys.App.Services.SymbolSearchServices.createSymbolSearch(data[s]);
            }
        } catch (error) {
            console.log('Error in generateSearchResult : ', error);
            return new Error('Error in generateSearchResult');
        }
    },


    /**
     * Demo Spin Reel Functions With New Payout Logic
     */

    demoSpinReels: async function (player, gamePlayer, bet, game, free, remainingChips, lastSpin, data) {
        try {
            /* var matrix = {};
            var reels = {
              reel_one: [],
              reel_two: [],
              reel_three: [],
              reel_four: [],
              reel_five: []
            };
            let symbolReels = await Sys.Game.Slot.Services.SymbolReelServices.getBySymbolReels({ game: data.id});
            symbolReels = JSON.stringify(symbolReels);
            symbolReels = JSON.parse(symbolReels);
            for (var s = 0; s < symbolReels.length; s++) {
              let symbol = await Sys.Game.Slot.Services.SymbolServices.getOneSymbol({ _id :symbolReels[s].symbol })
              let reel = await Sys.Game.Slot.Services.ReelServices.getOneReel({ _id :symbolReels[s].reel })

              symbolReels[s].symbol = symbol;
              symbolReels[s].reel = reel;
            }
            var newreels = {};
            symbolReels.forEach(async function (symbolReel) {
              if (newreels[symbolReel.reel]) {
                await Sys.Game.Slot.Controllers.RoomProcess.addSymbolToReel(newreels[symbolReel.reel], symbolReel.symbol, symbolReel.count);
              } else {
                newreels[symbolReel.reel] = [];
                await Sys.Game.Slot.Controllers.RoomProcess.addSymbolToReel(newreels[symbolReel.reel], symbolReel.symbol, symbolReel.count);
              }
            });
            var tempReal = [];
            for (const key in newreels) {
              if (newreels.hasOwnProperty(key)) {
                await Sys.Game.Slot.Controllers.RoomProcess.shuffle(newreels[key]);
              }
            }
            for (const key in newreels) {
              if (newreels.hasOwnProperty(key)) {
                const element = newreels[key];
                tempReal.push(element);
              }
            }

            combinations = [];
            let index = {
              reel_one: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[0].length),
              reel_two: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[1].length),
              reel_three: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[2].length),
              reel_four: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, data.id != '5bd9b169afdd62126b1b848f' ? tempReal[3].length : null),
              reel_five: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, data.id != '5bd9b169afdd62126b1b848f' ? tempReal[4].length : null),
            }

            for (let i = 0; i < 4; i++) {
              if (index.reel_one == tempReal[0].length) {
                index.reel_one = 0;
              }
              if (index.reel_two == tempReal[1].length) {
                index.reel_two = 0;
              }
              if (index.reel_three == tempReal[2].length) {
                index.reel_three = 0;
              }
              if (data.id != '5bd9b169afdd62126b1b848f' && index.reel_four == tempReal[3].length) {
                index.reel_four = 0;
              }
              if (data.id != '5bd9b169afdd62126b1b848f' && index.reel_five == tempReal[4].length) {
                index.reel_five = 0;
              }

              combinations.push({
                reel_one: tempReal[0][index.reel_one].id,
                reel_two: tempReal[1][index.reel_two].id,
                reel_three: tempReal[2][index.reel_three].id,
                reel_four: data.id != '5bd9b169afdd62126b1b848f' ? tempReal[3][index.reel_four].id : '',
                reel_five: data.id != '5bd9b169afdd62126b1b848f' ? tempReal[4][index.reel_five].id : ''
              });
              index.reel_one++;
              index.reel_two++;
              index.reel_three++;
              if (index.reel_four != null) {
                index.reel_four++;
              }
              if (index.reel_five != null) {
                index.reel_five++;
              }
            }
            combinations.forEach(function (combination, key) {
              var keyPrefix = key + 1;
              matrix['m' + keyPrefix + 1] = combination.reel_one;
              matrix['m' + keyPrefix + 2] = combination.reel_two;
              matrix['m' + keyPrefix + 3] = combination.reel_three;
              matrix['m' + keyPrefix + 4] = combination.reel_four;
              matrix['m' + keyPrefix + 5] = combination.reel_five;
              reels.reel_one.push(combination.reel_one);
              reels.reel_two.push(combination.reel_two);
              reels.reel_three.push(combination.reel_three);
              reels.reel_four.push((combination.reel_four) ? combination.reel_four : '');
              reels.reel_five.push((combination.reel_five) ? combination.reel_five : '');
            }); */

            let payoutMatrixData = await Sys.Game.Slot.Controllers.RoomProcess.getSymbolsMatrix(data);
            var matrix = payoutMatrixData.stringMatrix;
            var reels = payoutMatrixData.spinReelMatrix;

            let lines = await Sys.Game.Slot.Services.SlotGameServices.getByLine({ game: data.id });
            if (lines instanceof Error) {
                return { status: 'fail', result: null, message: lines.message, statusCode: 401 }
            }
            let symbols = await Sys.Game.Slot.Services.SlotGameServices.getSymbol({ symbol_type: 'symbol', game: data.id });
            if (symbols instanceof Error) {
                return { status: 'fail', result: null, message: symbols.message, statusCode: 401 }
            }
            let wild = await Sys.Game.Slot.Services.SlotGameServices.getOneSymbol({ symbol_type: 'wild', game: data.id });
            if (wild instanceof Error) {
                return { status: 'fail', result: null, message: wild.message, statusCode: 401 }
            }
            let searchResult = [];
            let linesMatrix = [];
            let history = [];
            lines = JSON.stringify(lines);
            lines = JSON.parse(lines);
            lines.forEach(function (line) {
                let remark = 'bet on game2';
                if (data.bonus == 1) {
                    remark = 'bonus spin';
                }
                if (!free) {
                    remainingChips = remainingChips - bet.chips;
                }

                history.push({
                    player: player.id,
                    gamePlayer: gamePlayer.id,
                    quantity: free ? 0 : bet.chips,
                    remaining: remainingChips,
                    remark: remark,
                    type: 'bet',
                    line: line.id,
                    spin: parseInt(lastSpin) + 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                var row = [];
                for (let row_id in line.matrix) {
                    for (let column_id in line.matrix[row_id]) {
                        if (line.matrix[row_id][column_id]) {
                            row.push({ row: row_id, col: column_id });
                        }
                    }
                }
                row.sort(function (a, b) { return (a.col > b.col) ? 1 : ((b.col > a.col) ? -1 : 0); });
                var rowData = [];
                game.rows.forEach(function (row) {
                    rowData.push(row.id);
                });
                var cols = [];
                game.reels.forEach(function (reel) {
                    cols.push(reel.id);
                });
                row.forEach(function (cell) {
                    var rowIndex = rowData.indexOf(cell.row) + 1;
                    var colIndex = cols.indexOf(cell.col) + 1;
                    line[`m${rowIndex}${colIndex}`] = true;
                });
                var lineTemp = '';
                var lineTempArray = [];
                for (var j = 1; j < 6; j++) {
                    for (var i = 1; i < 5; i++) {
                        var key = 'm' + i + j;
                        if (line[key] == true) {
                            lineTemp += String("ADGKZ" + String(matrix[key])).slice(-5);
                            lineTempArray.push(String("ADGKZ" + String(matrix[key])).slice(-5));
                        }
                    }
                }

                linesMatrix.push(lineTemp);
                var symbolCounts = [];

                if (wild) {
                    var wildSearchString = String("ADGKZ" + String(wild.id)).slice(-5);
                }
                // This code is for left to right combination for big slots and reverted code for small slot
                symbols.forEach(async function (symbol) {
                    var searchString = String("ADGKZ" + String(symbol.id)).slice(-5);
                    if (data.id == '5bd9b169afdd62126b1b848f') {
                        var count = (lineTemp.match(new RegExp(searchString, "g")) || []).length;
                        var symbolCount = 0;
                        switch (count) {
                            case 3:
                                symbolCount = 3;
                                break;
                            case 2:
                                symbolCount = 2;
                                break;
                            case 1:
                                symbolCount = 1;
                        }
                    } else {
                        var symbolCount = await Sys.Game.Slot.Controllers.RoomProcess.searchSymbole(searchString, wild ? wildSearchString : null, lineTempArray);
                    }

                    if (symbolCount == 1) {
                        if (data.id == '5bd9b169afdd62126b1b848f') {
                            symbolCount = 1;
                        } else {
                            // symbolCount = symbolCount
                            symbolCount = 0;
                        }
                    }
                    if (symbolCount > 0) {
                        symbolCounts.push({ symbol_id: symbol.id, count: symbolCount });
                    }
                });
                searchResult.push({ line_id: line.id, symbolCounts: symbolCounts });
            });

            var result = {
                matrix: reels,
                searchResult: searchResult
            };

            let addWinning = await Sys.Game.Slot.Controllers.RoomProcess.demoAddWinningChip(bet, linesMatrix, player, gamePlayer, result, history, lastSpin, data);

            return addWinning;
        } catch (error) {
            console.log('Error in demoSpinReels : ', error);
            return new Error('Error in demoSpinReels');
        }
    },

    demoAddWinningChip: async function (bet, lines, player, gamePlayer, result, history, lastSpin, data) {
        try {
            console.log("maulik lines", lines);
            let payouts = await Sys.Game.Slot.Services.SymbolReelServices.getSymbolPayout({ game: data.id });
            if (payouts instanceof Error) {
                return { status: 'fail', result: null, message: payouts.message, statusCode: 401 }
            }
            // var line_bet = bet;
            var line_bet = bet.chips;
            var totalWinning = 0;
            // console.log("payouts : ", payouts);

            let linesWithZeroWinning = []; // index of result.searchResult

            result.searchResult.forEach(function (line, lineIndex) {
                let lineTotal = 0;
                if (line.symbolCounts.length) {
                    line.symbolCounts.forEach(function (symbol) {
                        payouts.forEach(function (payout) {
                            if (symbol.symbol_id == payout.symbol) {
                                switch (symbol.count) {
                                    case 5:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.five_time));
                                        break;
                                    case 4:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.four_time));
                                        break;
                                    case 3:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.three_time));
                                        break;
                                    case 2:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.two_time));
                                        break;
                                    case 1:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.one_time));
                                        break;
                                }
                            }
                        });
                    });
                }

                totalWinning = totalWinning + lineTotal;
                if (lineTotal == 0) {
                    linesWithZeroWinning.push(lineIndex);
                }
                player.chips = parseInt(player.chips) + parseInt(lineTotal);
                history.push({
                    player: player.id,
                    gamePlayer: gamePlayer.id,
                    quantity: lineTotal,
                    remaining: player.chips,
                    remark: 'winning in game',
                    type: 'win',
                    line: line.line_id,
                    spin: parseInt(lastSpin) + 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            });

            for (let i = result.searchResult.length - 1; i >= 0; i--) {
                if (linesWithZeroWinning.indexOf(i) != -1) {
                    result.searchResult.splice(i, 1);
                }
            }
            result.totalWinning = totalWinning;

            var biggestWin = 0;
            history.forEach(function (chipData) {
                if (chipData.type == 'win') {
                    biggestWin = (biggestWin < chipData.quantity) ? chipData.quantity : biggestWin;
                }
            });
            if (player.statistics != null && player.statistics.hasOwnProperty('biggest_win')) {
                if (player.statistics.biggest_win < biggestWin) {
                    player.statistics.biggest_win = biggestWin;
                }
            } else {
                player.statistics = {};
                player.statistics.biggest_win = biggestWin;
            }
            var xp = (totalWinning) ? player.xp + 50 : player.xp + 10;
            let payout = await Sys.Game.Slot.Controllers.RoomProcess.checkForPayoutName(data, bet, totalWinning);
            xp = (payout) ? xp + 50 : xp;
            var level = await Sys.Game.Slot.Controllers.RoomProcess.checkLevel(xp);
            // console.log("room process addWinning --------------->>>",history)
            for (var h = 0; h < history.length; h++) {
                // if(history[h].type == 'win'){
                let transactions = await Sys.Game.Slot.Services.ChipsTransactionService.create({
                    player: history[h].player,
                    gamePlayer: history[h].gamePlayer,
                    quantity: history[h].quantity,
                    remaining: history[h].remaining,
                    remark: history[h].remark,
                    type: history[h].type,
                    line: history[h].line,
                    spin: history[h].spin,
                });
                // }
            }
            let transaction = {
                player: player.id,
                gamePlayer: gamePlayer.id,
                quantity: totalWinning,
                remaining: player.chips,
                remark: (payout) ? 'winning in game :' + payout.name : 'winning in game',
                type: 'win'
            };
            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                _id: player.id
            }, {
                xp: xp,
                level: level.level,
                chips: player.chips,
                statistics: player.statistics
            });
            result.level = level;
            result.payout_name = (payout) ? payout.name : null;
            transaction.level = level;
            let resultSearch = await Sys.Game.Slot.Controllers.RoomProcess.searchFreeSpin(data, lines, result);
            result = resultSearch;
            let game_player = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({ _id: transaction.gamePlayer });
            transaction.free_spin = result.free_spin;
            if (payout && bet) {
                if (bet.jackpot_eligible && payout.jackpot_eligible) {
                    await Sys.Game.Slot.Controllers.RoomProcess.checkForRoomJackpotDistribution(game_player, player);
                }
            }
            await Sys.Io.of(Sys.Config.Namespace.Slot).to(data.room).emit('PlayerWin', {
                roomNo: data.room,
                thems: game_player.theme,
                transaction: transaction,
                data: data
            });
            if (data) {
                return {
                    status: 'success',
                    message: 'Spin success.',
                    result: result
                }
            } else {
                if (data.hasOwnProperty('spinAgain')) {
                    return data.spinAgain;
                }
                // botSpinReels(game_player);
            }
            // });
            // console.log("searchSpin >>>>>>><<<<<<<<",searchSpin);
            // return searchSpin;
            // });
        } catch (error) {
            console.log('Error in demoAddWinningChip : ', error);
            return new Error('Error in demoAddWinningChip');
        }
    },

    getSymbolsMatrix: async function (data) {
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

            // Just reel log
            for (let i = 0; i < reels.length; i++) {
                if (reels[i].name == '1') {
                    console.log("This is the first reel :", reels[i].id);
                    break;
                }
            }

            let rows = await Sys.Game.Slot.Services.SlotGameServices.getRowsData({ game: data.id });
            // console.log("rows : ", rows);

            // Removing taken symbol from symbols array
            for (let i = 0; i < takenSymbol.length; i++) {
                for (let j = symbols.length - 1; j >= 0; j--) {
                    console.log("Symbols Loop : ", i, j, symbols[j]);
                    if (takenSymbol[i].symbol == symbols[j].id) {
                        console.log("Yes This is the taken Symbol : ", i, j, symbols[j]);
                        symbols.splice(j, 1);
                    }
                }
            }
            console.log("symbols before shuffle : ", symbols);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            symbols = await shuffle(symbols);
            console.log("symbols after shuffle : ", symbols);
            let stringMatrix = {};
            let spinReelMatrix = {
                reel_one: [],
                reel_two: [],
                reel_three: [],
                reel_four: [],
                reel_five: []
            };

            // Set random symbols on reel no. 3,4 & 5
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

            // Set random symbols on reel no. 1
            for (let i = 0; i < rows.length; i++) {
                let keyPrefix = i + 1;
                let reelOneIndex = await getRandomIntInclusive(0, symbols.length - 1);
                stringMatrix['m' + keyPrefix + 1] = symbols[reelOneIndex].id;
                spinReelMatrix.reel_one.push(symbols[reelOneIndex].id);
                symbols.splice(reelOneIndex, 1);
            }

            // console.log("symbols : ", symbols);
            // Set random symbols on reel no. 2
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


            return {
                stringMatrix,
                spinReelMatrix
            };
        } catch (e) {
            console.log("Catched Error in checkNewLogic fuction :", e);
            return new Error(e);
        }
    },

    /**
     * Demo Spin Reel Functions With Old Logic and Recursive Functionality
     */

    recSpinReels: async function (player, gamePlayer, bet, game, free, remainingChips, lastSpin, data, allSpinData) {
        try {
            var matrix = {};
            var reels = {
                reel_one: [],
                reel_two: [],
                reel_three: [],
                reel_four: [],
                reel_five: []
            };
            let symbolReels = await Sys.Game.Slot.Services.SymbolReelServices.getBySymbolReels({ game: data.id });
            symbolReels = JSON.stringify(symbolReels);
            symbolReels = JSON.parse(symbolReels);
            for (var s = 0; s < symbolReels.length; s++) {
                let symbol = await Sys.Game.Slot.Services.SymbolServices.getOneSymbol({ _id: symbolReels[s].symbol })
                let reel = await Sys.Game.Slot.Services.ReelServices.getOneReel({ _id: symbolReels[s].reel })

                symbolReels[s].symbol = symbol;
                symbolReels[s].reel = reel;
            }
            var newreels = {};
            symbolReels.forEach(async function (symbolReel) {
                // console.log("reels data <<===============>>",symbolReel);
                if (newreels[symbolReel.reel]) {
                    await Sys.Game.Slot.Controllers.RoomProcess.addSymbolToReel(newreels[symbolReel.reel], symbolReel.symbol, symbolReel.count);
                } else {
                    newreels[symbolReel.reel] = [];
                    await Sys.Game.Slot.Controllers.RoomProcess.addSymbolToReel(newreels[symbolReel.reel], symbolReel.symbol, symbolReel.count);
                }
            });
            var tempReal = [];
            for (const key in newreels) {
                if (newreels.hasOwnProperty(key)) {
                    await Sys.Game.Slot.Controllers.RoomProcess.shuffle(newreels[key]);
                }
            }
            for (const key in newreels) {
                if (newreels.hasOwnProperty(key)) {
                    const element = newreels[key];
                    tempReal.push(element);
                }
            }

            combinations = [];
            let index = {
                reel_one: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[0].length),
                reel_two: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[1].length),
                reel_three: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[2].length),
                reel_four: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, data.id != '5bd9b169afdd62126b1b848f' ? tempReal[3].length : null),
                reel_five: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, data.id != '5bd9b169afdd62126b1b848f' ? tempReal[4].length : null),
            }

            for (let i = 0; i < 4; i++) {
                if (index.reel_one == tempReal[0].length) {
                    index.reel_one = 0;
                }
                if (index.reel_two == tempReal[1].length) {
                    index.reel_two = 0;
                }
                if (index.reel_three == tempReal[2].length) {
                    index.reel_three = 0;
                }
                if (data.id != '5bd9b169afdd62126b1b848f' && index.reel_four == tempReal[3].length) {
                    index.reel_four = 0;
                }
                if (data.id != '5bd9b169afdd62126b1b848f' && index.reel_five == tempReal[4].length) {
                    index.reel_five = 0;
                }

                combinations.push({
                    reel_one: tempReal[0][index.reel_one].id,
                    reel_two: tempReal[1][index.reel_two].id,
                    reel_three: tempReal[2][index.reel_three].id,
                    reel_four: data.id != '5bd9b169afdd62126b1b848f' ? tempReal[3][index.reel_four].id : '',
                    reel_five: data.id != '5bd9b169afdd62126b1b848f' ? tempReal[4][index.reel_five].id : '',
                });
                index.reel_one++;
                index.reel_two++;
                index.reel_three++;
                if (index.reel_four != null) {
                    index.reel_four++;
                }
                if (index.reel_five != null) {
                    index.reel_five++;
                }
            }
            combinations.forEach(function (combination, key) {
                var keyPrefix = key + 1;
                matrix['m' + keyPrefix + 1] = combination.reel_one;
                matrix['m' + keyPrefix + 2] = combination.reel_two;
                matrix['m' + keyPrefix + 3] = combination.reel_three;
                matrix['m' + keyPrefix + 4] = combination.reel_four;
                matrix['m' + keyPrefix + 5] = combination.reel_five;
                reels.reel_one.push(combination.reel_one);
                reels.reel_two.push(combination.reel_two);
                reels.reel_three.push(combination.reel_three);
                reels.reel_four.push((combination.reel_four) ? combination.reel_four : '');
                reels.reel_five.push((combination.reel_five) ? combination.reel_five : '');
            });
            let lines = await Sys.Game.Slot.Services.SlotGameServices.getByLine({ game: data.id });
            if (lines instanceof Error) {
                return { status: 'fail', result: null, message: lines.message, statusCode: 401 }
            }
            let symbols = await Sys.Game.Slot.Services.SlotGameServices.getSymbol({ symbol_type: 'symbol', game: data.id });
            if (symbols instanceof Error) {
                return { status: 'fail', result: null, message: symbols.message, statusCode: 401 }
            }
            let wild = await Sys.Game.Slot.Services.SlotGameServices.getOneSymbol({ symbol_type: 'wild', game: data.id });
            if (wild instanceof Error) {
                return { status: 'fail', result: null, message: wild.message, statusCode: 401 }
            }
            let searchResult = [];
            let linesMatrix = [];
            let history = [];
            lines = JSON.stringify(lines);
            lines = JSON.parse(lines);
            lines.forEach(function (line) {
                let remark = 'bet on game3';
                if (data.bonus == 1) {
                    remark = 'bonus spin';
                }
                if (!free) {
                    remainingChips = remainingChips - bet.chips;
                }

                history.push({
                    player: player.id,
                    gamePlayer: gamePlayer.id,
                    quantity: free ? 0 : bet.chips,
                    remaining: remainingChips,
                    remark: remark,
                    type: 'bet',
                    line: line.id,
                    spin: parseInt(lastSpin) + 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                var row = [];
                for (let row_id in line.matrix) {
                    for (let column_id in line.matrix[row_id]) {
                        if (line.matrix[row_id][column_id]) {
                            row.push({ row: row_id, col: column_id });
                        }
                    }
                }
                row.sort(function (a, b) { return (a.col > b.col) ? 1 : ((b.col > a.col) ? -1 : 0); });
                var rowData = [];
                game.rows.forEach(function (row) {
                    rowData.push(row.id);
                });
                var cols = [];
                game.reels.forEach(function (reel) {
                    cols.push(reel.id);
                });
                row.forEach(function (cell) {
                    var rowIndex = rowData.indexOf(cell.row) + 1;
                    var colIndex = cols.indexOf(cell.col) + 1;
                    line[`m${rowIndex}${colIndex}`] = true;
                });
                var lineTemp = '';
                var lineTempArray = [];
                for (var j = 1; j < 6; j++) {
                    for (var i = 1; i < 5; i++) {
                        var key = 'm' + i + j;
                        if (line[key] == true) {
                            lineTemp += String("ADGKZ" + String(matrix[key])).slice(-5);
                            lineTempArray.push(String("ADGKZ" + String(matrix[key])).slice(-5));
                        }
                    }
                }

                linesMatrix.push(lineTemp);
                var symbolCounts = [];

                if (wild) {
                    var wildSearchString = String("ADGKZ" + String(wild.id)).slice(-5);
                }
                // This code is for left to right combination for big slots and reverted code for small slot
                symbols.forEach(async function (symbol) {
                    var searchString = String("ADGKZ" + String(symbol.id)).slice(-5);
                    if (data.id == '5bd9b169afdd62126b1b848f') {
                        var count = (lineTemp.match(new RegExp(searchString, "g")) || []).length;
                        var symbolCount = 0;
                        switch (count) {
                            case 3:
                                symbolCount = 3;
                                break;
                            case 2:
                                symbolCount = 2;
                                break;
                            case 1:
                                symbolCount = 1;
                        }
                    } else {
                        var symbolCount = await Sys.Game.Slot.Controllers.RoomProcess.searchSymbole(searchString, wild ? wildSearchString : null, lineTempArray);
                    }

                    if (symbolCount == 1) {
                        if (data.id == '5bd9b169afdd62126b1b848f') {
                            symbolCount = 1;
                        } else {
                            // symbolCount = symbolCount
                            symbolCount = 0;
                        }
                    }
                    if (symbolCount > 0) {
                        symbolCounts.push({ symbol_id: symbol.id, count: symbolCount });
                    }
                });
                searchResult.push({ line_id: line.id, symbolCounts: symbolCounts });
            });

            var result = {
                matrix: reels,
                searchResult: searchResult
            };
            // console.log("result.searchResult", result.searchResult);
            let addWinning = await Sys.Game.Slot.Controllers.RoomProcess.recAddWinningChips(bet, linesMatrix, player, gamePlayer, result, history, lastSpin, data, allSpinData);
            return addWinning;
        } catch (error) {
            console.log('Catched Error in recSpinReels :', error);
            return new Error('Error in recSpinReels');
        }
    },

    recAddWinningChips: async function (bet, lines, player, gamePlayer, result, history, lastSpin, data, allSpinData) {
        try {
            // console.log("in add winning func ", result.searchResult);
            var line_bet = bet.chips;
            var totalWinning = 0;

            let linesWithZeroWinning = []; // index of result.searchResult
            let linesWithWinnings = []; // for winning history

            result.searchResult.forEach(function (line, lineIndex) {
                let lineTotal = 0;
                if (line.symbolCounts.length) {
                    line.symbolCounts.forEach(function (symbol) {
                        payouts.forEach(function (payout) {
                            if (symbol.symbol_id == payout.symbol) {
                                switch (symbol.count) {
                                    case 5:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.five_time));
                                        break;
                                    case 4:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.four_time));
                                        break;
                                    case 3:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.three_time));
                                        break;
                                    case 2:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.two_time));
                                        break;
                                    case 1:
                                        lineTotal = lineTotal + (parseFloat(line_bet) * parseFloat(payout.one_time));
                                        break;
                                }
                            }
                        });
                    });
                }

                totalWinning = totalWinning + lineTotal;
                if (lineTotal == 0) {
                    linesWithZeroWinning.push(lineIndex);
                } else {
                    linesWithWinnings.push({
                        lineTotal: lineTotal,
                        line_id: line.line_id
                    });
                }

            });

            // Check If totalWinning is within payout ratio or not
            for (let ind = 0; ind < 1000; ind++) {
                if (totalWinning == allSpinData.payoutData.exactPay || (totalWinning <= allSpinData.payoutData.upperPay && totalWinning >= allSpinData.payoutData.exactPay) || (totalWinning >= allSpinData.payoutData.lowerPay && totalWinning <= allSpinData.payoutData.exactPay)) {
                    console.log("got payout from this spin", ind, totalWinning);
                    break;
                } else {
                    console.log("can't get payout from this spin", ind, totalWinning);
                    await Sys.Game.Slot.Controllers.RoomProcess.recSpinReels(allSpinData.player, allSpinData.gamePlayer, allSpinData.bet, allSpinData.game, allSpinData.free, allSpinData.remainingChips, allSpinData.lastSpin, allSpinData.data, allSpinData);
                    console.log("after rec function");
                }
                console.log("Out Of Conditions _________________", ind);
            }

            for (let i = result.searchResult.length - 1; i >= 0; i--) {
                if (linesWithZeroWinning.indexOf(i) != -1) {
                    result.searchResult.splice(i, 1);
                }
            }

            // Player winning in lines chips transaction history push
            for (let i = 0; i < linesWithWinnings.length; i++) {
                player.chips = parseInt(player.chips) + parseFloat(linesWithWinnings[i].lineTotal);
                history.push({
                    player: player.id,
                    gamePlayer: gamePlayer.id,
                    quantity: linesWithWinnings[i].lineTotal,
                    remaining: player.chips,
                    remark: 'winning in game',
                    type: 'win',
                    line: linesWithWinnings[i].line_id,
                    spin: parseInt(lastSpin) + 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
            result.totalWinning = totalWinning;

            var biggestWin = 0;
            history.forEach(function (chipData) {
                if (chipData.type == 'win') {
                    biggestWin = (biggestWin < chipData.quantity) ? chipData.quantity : biggestWin;
                }
            });
            if (player.statistics != null && player.statistics.hasOwnProperty('biggest_win')) {
                if (player.statistics.biggest_win < biggestWin) {
                    player.statistics.biggest_win = biggestWin;
                }
            } else {
                player.statistics = {};
                player.statistics.biggest_win = biggestWin;
            }
            var xp = (totalWinning) ? player.xp + 50 : player.xp + 10;
            let payout = await Sys.Game.Slot.Controllers.RoomProcess.checkForPayoutName(data, bet, totalWinning);
            xp = (payout) ? xp + 50 : xp;
            var level = await Sys.Game.Slot.Controllers.RoomProcess.checkLevel(xp);
            // console.log("room process addWinning --------------->>>",history)
            for (var h = 0; h < history.length; h++) {
                // if(history[h].type == 'win'){
                await Sys.Game.Slot.Services.ChipsTransactionService.create({
                    player: history[h].player,
                    gamePlayer: history[h].gamePlayer,
                    quantity: history[h].quantity,
                    remaining: history[h].remaining,
                    remark: history[h].remark,
                    type: history[h].type,
                    line: history[h].line,
                    spin: history[h].spin,
                });
                // }
            }
            let transaction = {
                player: player.id,
                gamePlayer: gamePlayer.id,
                quantity: totalWinning,
                remaining: player.chips,
                remark: (payout) ? 'winning in game :' + payout.name : 'winning in game',
                type: 'win',
            };
            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                _id: player.id
            }, {
                xp: xp,
                level: level.level,
                chips: player.chips,
                statistics: player.statistics
            });
            result.level = level;
            result.payout_name = (payout) ? payout.name : null;
            transaction.level = level;
            let resultSearch = await Sys.Game.Slot.Controllers.RoomProcess.searchFreeSpin(data, lines, result);
            result = resultSearch;
            let game_player = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({ _id: transaction.gamePlayer });
            transaction.free_spin = result.free_spin;
            if (payout && bet) {
                if (bet.jackpot_eligible && payout.jackpot_eligible) {
                    await Sys.Game.Slot.Controllers.RoomProcess.checkForRoomJackpotDistribution(game_player, player);
                }
            }
            await Sys.Io.of(Sys.Config.Namespace.Slot).to(data.room).emit('PlayerWin', {
                roomNo: data.room,
                thems: game_player.theme,
                transaction: transaction,
                data: data
            });
            return {
                status: 'success',
                message: 'Spin success.',
                result: result
            }
        } catch (error) {
            console.log('Catched Error in recAddWinningChips :', error);
            return new Error('Error in recAddWinningChips');
        }
    },


    /**
     * Demo Spin Reel Functions With Old Logic and Recursive Functionality
     */

    getPayoutAmount: async function (bet, lines) {
        try {
            let payColumns = ['payoutRatio', 'jackpotPlan', 'desiredIncomeRatio', 'totalInward', 'totalOutward', 'totalIncome', 'desiredIncome', 'differenceIncome', 'differenceRatio'];
            let payoutData = await Sys.Game.Slot.Services.SettingServices.findOne({}, payColumns);
            console.log("payoutData", payoutData);
            // Default Payout
            let exactPayout = convertFloatVal((parseFloat(bet) * lines) * payoutData.payoutRatio / 100);

            // Case 1 : We Have Stable Payout
            if (payoutData.differenceRatio >= (payoutData.desiredIncomeRatio * -1) && payoutData.differenceRatio <= payoutData.desiredIncomeRatio) {
                console.log("in first stable case");
                console.log("================================================");
                let randomPay = await getRandomIntInclusive((100 - payoutData.desiredIncomeRatio), (100 + payoutData.desiredIncomeRatio));
                console.log("randomPay :", randomPay);
                exactPayout = convertFloatVal((parseFloat(bet) * lines) * randomPay / 100); // (20 * 5) * 102 / 100 = 102
                console.log("exactPayout :", exactPayout);
            } else {
                // Case 2 : We Have Minus Payout
                if (payoutData.differenceRatio < payoutData.desiredIncomeRatio) {
                    console.log("in second minus case");
                    console.log("================================================");
                    let totalBet = convertFloatVal(parseFloat(bet) * lines);
                    console.log("totalBet :", totalBet);
                    exactPayout = totalBet * payoutData.payoutRatio / 100;
                    console.log("exactPayout :", exactPayout);
                    let income = totalBet - exactPayout;
                    console.log("income :", income);
                    let totalIncome = income + (payoutData.differenceIncome * -1);
                    console.log("totalIncome :", totalIncome);
                    exactPayout = totalBet - totalIncome;
                    console.log("exactPayout :", exactPayout);
                }
                // Case 3 : We Have Plus Payout
                else { // payoutData.differenceRatio > payoutData.desiredIncomeRatio
                    console.log("in third plus case");
                    console.log("================================================");
                    let totalBet = convertFloatVal(parseFloat(bet) * lines);
                    console.log("totalBet :", totalBet);
                    let totalWin = convertFloatVal(totalBet * payoutData.payoutRatio / 100);
                    console.log("totalWin :", totalWin);
                    let maxWin = convertFloatVal(totalWin + payoutData.differenceIncome);
                    console.log("maxWin :", maxWin);
                    exactPayout = await getRandomIntInclusive(totalWin, maxWin);
                    if (exactPayout > (parseFloat(totalBet) * 10)) {
                        exactPayout = parseFloat(totalBet) * 10;
                    }
                    console.log("exactPayout :", exactPayout);
                }
            }

            return exactPayout;
        } catch (error) {
            console.log('Catched Error in getPayoutAmount :', error);
            return new Error('Error in getPayoutAmount');
        }
    },

    allInOneSpinReels: async function (player, gamePlayer, bet, game, free, remainingChips, lastSpin, data) {
        try {
            console.log("maulik Data", data);
            console.log("allInOneSpinReels function call");
            let winningPayout = {
                totalWinning: 0,
                linesWithZeroWinning: [],
                linesWithWinnings: []
            };
            let matrix = {};
            let reels = {
                reel_one: [],
                reel_two: [],
                reel_three: [],
                reel_four: [],
                reel_five: []
            };
            let linesMatrix = [];
            let history = [];
            let symbolReels = await Sys.Game.Slot.Services.SymbolReelServices.getBySymbolReels({ game: data.id });
            console.log("symbolReels", symbolReels)

            symbolReels = JSON.stringify(symbolReels);
            symbolReels = JSON.parse(symbolReels);
            for (var s = 0; s < symbolReels.length; s++) {
                let symbol = await Sys.Game.Slot.Services.SymbolServices.getOneSymbol({ _id: symbolReels[s].symbol })
                let reel = await Sys.Game.Slot.Services.ReelServices.getOneReel({ _id: symbolReels[s].reel })

                symbolReels[s].symbol = symbol;
                symbolReels[s].reel = reel;
            }
            var newreels = {};
            symbolReels.forEach(async function (symbolReel) {
                // console.log("reels data <<===============>>",symbolReel);
                if (newreels[symbolReel.reel]) {
                    await Sys.Game.Slot.Controllers.RoomProcess.addSymbolToReel(newreels[symbolReel.reel], symbolReel.symbol, symbolReel.count);
                } else {
                    newreels[symbolReel.reel] = [];
                    await Sys.Game.Slot.Controllers.RoomProcess.addSymbolToReel(newreels[symbolReel.reel], symbolReel.symbol, symbolReel.count);
                }
            });



            console.log("allInOneSpinReels", data.id);
            // taken code for preventing db query in loop
            let queryLine = { game: data.id }
            let limit = data.lines
            let lines = await Sys.Game.Slot.Services.SlotGameServices.getByLine(queryLine, limit);
            console.log("maulik lines count", lines);
            if (lines instanceof Error) {
                return { status: 'fail', result: null, message: lines.message, statusCode: 401 }
            }
            let symbols = await Sys.Game.Slot.Services.SlotGameServices.getSymbol({ symbol_type: 'symbol', game: data.id });
            if (symbols instanceof Error) {
                return { status: 'fail', result: null, message: symbols.message, statusCode: 401 }
            }
            let wild = await Sys.Game.Slot.Services.SlotGameServices.getOneSymbol({ symbol_type: 'wild', game: data.id });
            if (wild instanceof Error) {
                return { status: 'fail', result: null, message: wild.message, statusCode: 401 }
            }
            let payouts = await Sys.Game.Slot.Services.SymbolReelServices.getSymbolPayout({ game: data.id });
            if (payouts instanceof Error) {
                return { status: 'fail', result: null, message: payouts.message, statusCode: 401 }
            }


            // Payout Checking Loop starts from here
            console.log("Payout Checking Loop starts from here");
            for (let payIndex = 0; payIndex < 1000; payIndex++) {
                console.log("In Loop Index", payIndex);
                matrix = {};
                reels = {
                    reel_one: [],
                    reel_two: [],
                    reel_three: [],
                    reel_four: [],
                    reel_five: []
                };
                var tempReal = [];
                for (const key in newreels) {
                    if (newreels.hasOwnProperty(key)) {
                        console.log("maulik", key)
                        await Sys.Game.Slot.Controllers.RoomProcess.shuffle(newreels[key]);
                    }
                }
                console.log("newreels", newreels);
                for (const key in newreels) {
                    if (newreels.hasOwnProperty(key)) {
                        const element = newreels[key];
                        tempReal.push(element);
                    }
                }

                combinations = [];
                let index = {
                    reel_one: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[0].length),
                    reel_two: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[1].length),
                    reel_three: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[2].length),
                    reel_four: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, data.id != '5bd9b169afdd62126b1b848f' ? tempReal[3].length : null),
                    reel_five: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, data.id != '5bd9b169afdd62126b1b848f' ? tempReal[4].length : null),
                }
                console.log("index", index)
                for (let i = 0; i < 4; i++) {
                    if (index.reel_one == tempReal[0].length) {
                        index.reel_one = 0;
                    }
                    if (index.reel_two == tempReal[1].length) {
                        index.reel_two = 0;
                    }
                    if (index.reel_three == tempReal[2].length) {
                        index.reel_three = 0;
                    }
                    if (data.id != '5bd9b169afdd62126b1b848f' && index.reel_four == tempReal[3].length) {
                        index.reel_four = 0;
                    }
                    if (data.id != '5bd9b169afdd62126b1b848f' && index.reel_five == tempReal[4].length) {
                        index.reel_five = 0;
                    }

                    combinations.push({
                        reel_one: tempReal[0][index.reel_one].id,
                        reel_two: tempReal[1][index.reel_two].id,
                        reel_three: tempReal[2][index.reel_three].id,
                        reel_four: data.id != '5bd9b169afdd62126b1b848f' ? tempReal[3][index.reel_four].id : '',
                        reel_five: data.id != '5bd9b169afdd62126b1b848f' ? tempReal[4][index.reel_five].id : '',
                    });
                    index.reel_one++;
                    index.reel_two++;
                    index.reel_three++;
                    if (index.reel_four != null) {
                        index.reel_four++;
                    }
                    if (index.reel_five != null) {
                        index.reel_five++;
                    }
                }
                combinations.forEach(function (combination, key) {
                    var keyPrefix = key + 1;
                    matrix['m' + keyPrefix + 1] = combination.reel_one;
                    matrix['m' + keyPrefix + 2] = combination.reel_two;
                    matrix['m' + keyPrefix + 3] = combination.reel_three;
                    matrix['m' + keyPrefix + 4] = combination.reel_four;
                    matrix['m' + keyPrefix + 5] = combination.reel_five;
                    reels.reel_one.push(combination.reel_one);
                    reels.reel_two.push(combination.reel_two);
                    reels.reel_three.push(combination.reel_three);
                    reels.reel_four.push((combination.reel_four) ? combination.reel_four : '');
                    reels.reel_five.push((combination.reel_five) ? combination.reel_five : '');
                });

                let searchResult = [];
                // let linesMatrix = [];
                linesMatrix = [];
                // let history = [];
                let quantity = 0;
                lines = JSON.stringify(lines);
                lines = JSON.parse(lines);
                console.log("maulik lines length", lines.length);
                let lineIndexx = 0;
                // lines.forEach(function (line){
                let remark = '';
                for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                    let line = lines[lineIndex];
                    remark = 'bet on game4';
                    if (data.bonus == 1) {
                        remark = 'bonus spin';
                    }
                    if (!free) {
                        remainingChips = convertFloatVal(remainingChips - parseFloat(bet));
                    }
                    quantity += free ? 0 : parseFloat(bet);
                    // console.log("Bet :", parseFloat(bet));
                    // console.log("RemainingChips :", remainingChips);
                    /* history.push({
                       player: player.id,
                       gamePlayer: gamePlayer.id,
                       quantity: free ? 0 : parseFloat(bet),
                       remaining: remainingChips,
                       remark: remark,
                       type: 'bet',
                       line: line.id,
                       // spin: parseInt(lastSpin) + 1,
                       spin: lastSpin,
                       createdAt: new Date(),
                       updatedAt: new Date()
                     }); */

                    var row = [];
                    for (let row_id in line.matrix) {
                        for (let column_id in line.matrix[row_id]) {
                            if (line.matrix[row_id][column_id]) {
                                row.push({ row: row_id, col: column_id });
                            }
                        }
                    }
                    row.sort(function (a, b) { return (a.col > b.col) ? 1 : ((b.col > a.col) ? -1 : 0); });
                    var rowData = [];
                    game.rows.forEach(function (row) {
                        rowData.push(row.id);
                    });
                    var cols = [];
                    game.reels.forEach(function (reel) {
                        cols.push(reel.id);
                    });
                    row.forEach(function (cell) {
                        var rowIndex = rowData.indexOf(cell.row) + 1;
                        var colIndex = cols.indexOf(cell.col) + 1;
                        line[`m${rowIndex}${colIndex}`] = true;
                    });
                    var lineTemp = '';
                    var lineTempArray = [];
                    for (var j = 1; j < 6; j++) {
                        for (var i = 1; i < 5; i++) {
                            var key = 'm' + i + j;
                            if (line[key] == true) {
                                lineTemp += String("ADGKZ" + String(matrix[key])).slice(-5);
                                lineTempArray.push(String("ADGKZ" + String(matrix[key])).slice(-5));
                            }
                        }
                    }

                    linesMatrix.push(lineTemp);
                    var symbolCounts = [];

                    if (wild) {
                        var wildSearchString = String("ADGKZ" + String(wild.id)).slice(-5);
                    }
                    // This code is for left to right combination for big slots and reverted code for small slot
                    // symbols.forEach(async function (symbol) {
                    for (let symbolIndex = 0; symbolIndex < symbols.length; symbolIndex++) {
                        let symbol = symbols[symbolIndex];
                        var searchString = String("ADGKZ" + String(symbol.id)).slice(-5);
                        if (data.id == '5bd9b169afdd62126b1b848f') {
                            var count = (lineTemp.match(new RegExp(searchString, "g")) || []).length;
                            var symbolCount = 0;
                            switch (count) {
                                case 3:
                                    symbolCount = 3;
                                    break;
                                case 2:
                                    symbolCount = 2;
                                    break;
                                case 1:
                                    symbolCount = 1;
                            }
                        } else {
                            var symbolCount = await Sys.Game.Slot.Controllers.RoomProcess.searchSymbole(searchString, wild ? wildSearchString : null, lineTempArray);
                        }

                        if (symbolCount == 1) {
                            if (data.id == '5bd9b169afdd62126b1b848f') {
                                symbolCount = 1;
                            } else {
                                // symbolCount = symbolCount;
                                symbolCount = 0;
                            }
                        }
                        if (symbolCount > 0) {
                            symbolCounts.push({ symbol_id: symbol.id, count: symbolCount });
                        }
                        // });
                    }
                    searchResult.push({ line_id: line.id, symbolCounts: symbolCounts });
                    // });
                }

                history.push({
                    player: player.id,
                    gamePlayer: gamePlayer.id,
                    quantity: quantity,
                    remaining: remainingChips,
                    remark: remark,
                    type: 'bet',
                    line: null,
                    /* spin: parseInt(lastSpin) + 1, */
                    spin: lastSpin,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                var result = {
                    matrix: reels,
                    searchResult: searchResult
                };
                console.log("result", result)
                // console.log("result.searchResult", result.searchResult);
                winningPayout = await Sys.Game.Slot.Controllers.RoomProcess.checkPayoutFromMatrix(bet, result, payouts);
                console.log("winningPayout :", winningPayout.totalWinning);

                if (winningPayout.totalWinning <= data.fixedPayout) {
                    console.log("Got Payout Below FixedPayout", winningPayout.totalWinning);
                    break;
                } else if (data.fixedPayout <= 0 && winningPayout.totalWinning == 0) {
                    console.log("FixedPayout is less than or equals to zero, so winning is zero", winningPayout.totalWinning);
                    break;
                }
                console.log("Can't Get Payout");
                if (payIndex == 999) {
                    return false;
                }
            }
            console.log("Payout Checking Loop Ends here");
            // Payout Checking Loop Ends here


            let addWinning = await Sys.Game.Slot.Controllers.RoomProcess.addWinningChipsFromPayout(bet, linesMatrix, player, gamePlayer, result, history, lastSpin, winningPayout, data);
            return addWinning;

        } catch (error) {
            console.log('Catched Error in recSpinReels :', error);
            return new Error('Error in recSpinReels');
        }
    },

    checkPayoutFromMatrix: async function (bet, result, payouts) {
        try {
            // console.log("bet", bet);
            // console.log("result", result.matrix);
            // console.log("payouts", payouts);
            var line_bet = bet;
            var totalWinning = 0;

            let linesWithZeroWinning = []; // index of result.searchResult
            let linesWithWinnings = []; // for winning history

            result.searchResult.forEach(function (line, lineIndex) {
                let lineTotal = 0;
                if (line.symbolCounts.length) {
                    line.symbolCounts.forEach(function (symbol) {
                        payouts.forEach(function (payout) {
                            if (symbol.symbol_id == payout.symbol) {
                                switch (symbol.count) {
                                    case 5:
                                        lineTotal = convertFloatVal(lineTotal + (parseFloat(line_bet) * parseFloat(payout.five_time)));
                                        break;
                                    case 4:
                                        lineTotal = convertFloatVal(lineTotal + (parseFloat(line_bet) * parseFloat(payout.four_time)));
                                        break;
                                    case 3:
                                        lineTotal = convertFloatVal(lineTotal + (parseFloat(line_bet) * parseFloat(payout.three_time)));
                                        break;
                                    case 2:
                                        lineTotal = convertFloatVal(lineTotal + (parseFloat(line_bet) * parseFloat(payout.two_time)));
                                        break;
                                    case 1:
                                        lineTotal = convertFloatVal(lineTotal + (parseFloat(line_bet) * parseFloat(payout.one_time)));
                                        break;
                                }
                            }
                        });
                    });
                }

                totalWinning = convertFloatVal(totalWinning + lineTotal);
                if (lineTotal == 0) {
                    linesWithZeroWinning.push(lineIndex);
                } else {
                    linesWithWinnings.push({
                        lineTotal: lineTotal,
                        line_id: line.line_id
                    });
                }
            });

            return {
                totalWinning: totalWinning,
                linesWithZeroWinning: linesWithZeroWinning,
                linesWithWinnings: linesWithWinnings
            }
        } catch (error) {
            console.log('Catched Error in recAddWinningChips :', error);
            return new Error('Error in recAddWinningChips');
        }
    },

    addWinningChipsFromPayout: async function (bet, lines, player, gamePlayer, result, history, lastSpin, winningPayout, data) {
        try {
            console.log("maulik lines", lines);
            console.log("maulik bets", bet);
            console.log("maulik result", result);
            console.log("in addWinningChipsFromPayout funciton");
            let totalWinning = winningPayout.totalWinning;
            let linesWithZeroWinning = winningPayout.linesWithZeroWinning;
            let linesWithWinnings = winningPayout.linesWithWinnings;

            for (let i = result.searchResult.length - 1; i >= 0; i--) {
                if (linesWithZeroWinning.indexOf(i) != -1) {
                    result.searchResult.splice(i, 1);
                }
            }
            let totalWinAmmount = 0
            // Player winning in lines chips transaction history push
            for (let i = 0; i < linesWithWinnings.length; i++) {
                // player.chips = convertFloatVal(parseFloat(player.chips) + parseFloat(linesWithWinnings[i].lineTotal));
                totalWinAmmount += parseFloat(linesWithWinnings[i].lineTotal)
                /* history.push({
                  player: player.id,
                  gamePlayer: gamePlayer.id,
                  quantity: linesWithWinnings[i].lineTotal,
                  remaining: player.chips,
                  remark: 'winning in game',
                  type: 'win',
                  line: linesWithWinnings[i].line_id,
                  // spin: parseInt(lastSpin) + 1,
                  spin: lastSpin,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }); */
            }
            let payoutRatioSetting = await Sys.App.Services.SettingsServices.getPayoutSettingData({},['payoutRatio'])
            let afterCommission = (totalWinAmmount * payoutRatioSetting.payoutRatio)/100
            player.chips = convertFloatVal(parseFloat(player.chips) + parseFloat(afterCommission));
            console.log("maulikLog", bet);
            console.log("maulikLog", totalWinning);
                console.log("totalWinning",totalWinning);
          
              if(totalWinning > 0){
                history.push({
                    player: player.id,
                    gamePlayer: gamePlayer.id,
                    quantity: totalWinning,
                    remaining: player.chips,
                    remark: 'winning in game',
                    type: 'win',
                    line: null,
                    /* spin: parseInt(lastSpin) + 1, */
                    spin: lastSpin,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                // if(totalWinning > 0){
                    let userQuery = [{ $match: { _id: ObjectId(player.id),isGuestPlayer:false } }, {
                        $lookup: {
                            from: 'user',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'userData'
                        }
                    }]
                    let userData = await Sys.App.Services.PlayerServices.getPlayerDataLookupAggregate(userQuery);
                    // console.log("userData winning",userData[0].userData[0]);
                    let tranumber =+ new Date()
                    if(userData.length > 0){
                        if(userData[0].userData[0].role == 'admin'){
                            console.log("afterCommission of admin",typeof afterCommission);
                            // let user = await Sys.App.Services.UserServices.getOneByData({_id:ObjectId(userData[0].userData[0]._id)});
                            // console.log("user commission",user.commissionAmount,afterCommission,user.commissionAmount-afterCommission);
                            await Sys.App.Services.UserServices.updateUserData({_id:ObjectId(userData[0].userData[0]._id)},{$inc:{commissionAmount:-afterCommission}})
                            await Sys.App.Services.UserServices.createCommission({name:userData[0].userData[0].name,role:userData[0].userData[0].role,commission:100,price:afterCommission,transactionId:tranumber,transactionType:'debit'})
                        }
                        else if(userData[0].userData[0].role == 'site-owner'){
                            let siteOwnerData = await Sys.App.Services.UserServices.getOneByData({_id:userData[0].userData[0]._id})
                            console.log("siteOwnerData commission",siteOwnerData);
                            let adminData = await Sys.App.Services.UserServices.getOneByData({_id:siteOwnerData.userId})
                            console.log("adminData commission",adminData);
        
                            /*admin commission start*/
                            let commissionOfAdmin = 100 - siteOwnerData.totalCommission
                            let totalAmountOfAdminCommission = Number(afterCommission)*Number(commissionOfAdmin)/100
                            console.log("totalAmountOfAdminCommission",totalAmountOfAdminCommission);
    
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(adminData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfAdminCommission
                                }
                            })
    
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:adminData.name,
                                role:adminData.role,
                                commission:commissionOfAdmin,
                                price:totalAmountOfAdminCommission,
                                userId:adminData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                            /*admin commission end*/
    
                            /*siteOwner commission start*/
                            let commissionOfSiteOwner = siteOwnerData.commission 
                            console.log("commissionOfSiteOwner",commissionOfSiteOwner);
                            let totalAmountOfSiteOwnerCommission = Number(afterCommission)*Number(commissionOfSiteOwner)/100
                            console.log("totalAmountOfSiteOwnerCommission",totalAmountOfSiteOwnerCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(siteOwnerData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfSiteOwnerCommission
                                }
                            })
    
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:siteOwnerData.name,
                                role:siteOwnerData.role,
                                commission:siteOwnerData.commission,
                                price:totalAmountOfSiteOwnerCommission,
                                userId:siteOwnerData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                            /*siteOwner commission end*/
                        }
                        else if(userData[0].userData[0].role == 'grand-master'){
                            let grandMasterData = await Sys.App.Services.UserServices.getOneByData({_id:userData[0].userData[0]._id})
                            console.log("grandMasterData commission",grandMasterData);
                            let siteOwnerData = await Sys.App.Services.UserServices.getOneByData({_id:grandMasterData.userId})
                            console.log("siteOwnerData commission",siteOwnerData);
                            let adminData = await Sys.App.Services.UserServices.getOneByData({_id:siteOwnerData.userId})
                            console.log("adminData commission",adminData);
                           
        
                            /*admin commission start*/
                            let commissionOfAdmin = 100 - siteOwnerData.totalCommission
                            let totalAmountOfAdminCommission = Number(afterCommission)*Number(commissionOfAdmin)/100
                            console.log("totalAmountOfAdminCommission",totalAmountOfAdminCommission);
        
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(adminData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfAdminCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:adminData.name,
                                role:adminData.role,
                                commission:commissionOfAdmin,
                                price:totalAmountOfAdminCommission,
                                userId:adminData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                            /*admin commission end*/
        
                            /*siteOwner commission start*/
                            let commissionOfSiteOwner = siteOwnerData.commission - grandMasterData.commission
                            console.log("commissionOfSiteOwner",commissionOfSiteOwner);
                            let totalAmountOfSiteOwnerCommission = Number(afterCommission)*Number(commissionOfSiteOwner)/100
                            console.log("totalAmountOfSiteOwnerCommission",totalAmountOfSiteOwnerCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(siteOwnerData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfSiteOwnerCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:siteOwnerData.name,
                                role:siteOwnerData.role,
                                commission:siteOwnerData.commission,
                                price:totalAmountOfSiteOwnerCommission,
                                userId:siteOwnerData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                            /*siteOwner commission end*/
        
        
                            /*grandMaster commission start*/
                            //grandMaster Commission
                            let commissionOfGrandMaster = grandMasterData.commission
                            console.log("commissionOfGrandMaster",commissionOfGrandMaster);
                            let totalAmountOfGrandMasterCommission = Number(afterCommission)*Number(commissionOfGrandMaster)/100
                            console.log("totalAmountOfGrandMasterCommission",totalAmountOfGrandMasterCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(grandMasterData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfGrandMasterCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:grandMasterData.name,
                                role:grandMasterData.role,
                                commission:grandMasterData.commission,
                                price:totalAmountOfGrandMasterCommission,
                                userId:grandMasterData.userId,
                                createdBy:siteOwnerData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                            /*grandMaster commission end*/
        
                        }
                        else if(userData[0].userData[0].role == 'master'){
                            let masterData = await Sys.App.Services.UserServices.getOneByData({_id:userData[0].userData[0]._id})
                            console.log("masterData commission",masterData);
                            let grandMasterData = await Sys.App.Services.UserServices.getOneByData({_id:masterData.userId})
                            console.log("grandMasterData commission",grandMasterData);
                            let siteOwnerData = await Sys.App.Services.UserServices.getOneByData({_id:grandMasterData.userId})
                            console.log("siteOwnerData commission",siteOwnerData);
                            let adminData = await Sys.App.Services.UserServices.getOneByData({_id:siteOwnerData.userId})
                            console.log("adminData commission",adminData);
        
                            /*admin commission start*/
                            let commissionOfAdmin = 100 - siteOwnerData.totalCommission
                            console.log("commissionOfAdmin",commissionOfAdmin);
                            let totalAmountOfAdminCommission = Number(afterCommission) * Number(commissionOfAdmin)/100
                            console.log("totalAmountOfAdminCommission",totalAmountOfAdminCommission);
        
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(adminData._id)
                            },{
                                $inc:{
                                    commissionAmount:-totalAmountOfAdminCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:adminData.name,
                                role:adminData.role,
                                commission:commissionOfAdmin,
                                price:totalAmountOfAdminCommission,
                                userId:adminData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                            /*admin commission end*/
        
                            /*siteOwner commission start*/
                            let commissionOfSiteOwner = siteOwnerData.commission - grandMasterData.commission
                            console.log("commissionOfSiteOwner",commissionOfSiteOwner);
                            let totalAmountOfSiteOwnerCommission = Number(afterCommission)*Number(commissionOfSiteOwner)/100
                            console.log("totalAmountOfSiteOwnerCommission",totalAmountOfSiteOwnerCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(siteOwnerData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfSiteOwnerCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:siteOwnerData.name,
                                role:siteOwnerData.role,
                                commission:siteOwnerData.commission,
                                price:totalAmountOfSiteOwnerCommission,
                                userId:siteOwnerData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                            /*siteOwner commission end*/
        
        
                            /*grandMaster commission start*/
                            //grandMaster Commission
                            let commissionOfGrandMaster = grandMasterData.commission - masterData.commission
                            console.log("commissionOfGrandMaster",commissionOfGrandMaster);
                            let totalAmountOfGrandMasterCommission = Number(afterCommission)*Number(commissionOfGrandMaster)/100
                            console.log("totalAmountOfGrandMasterCommission",totalAmountOfGrandMasterCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(grandMasterData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfGrandMasterCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:grandMasterData.name,
                                role:grandMasterData.role,
                                commission:grandMasterData.commission,
                                price:totalAmountOfGrandMasterCommission,
                                userId:grandMasterData.userId,
                                createdBy:siteOwnerData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                            /*grandMaster commission end*/
        
                            /*master commission start*/
                            //master Commission
                            let commissionOfMaster =  masterData.commission 
                            console.log("commissionOfMaster",commissionOfMaster);
                            let totalAmountOfMasterCommission = Number(afterCommission)*Number(commissionOfMaster)/100
                            console.log("totalAmountOfMasterCommission",totalAmountOfMasterCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(masterData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfMasterCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:masterData.name,
                                role:masterData.role,
                                commission:masterData.commission,
                                price:totalAmountOfMasterCommission,
                                userId:masterData.userId,
                                createdBy:grandMasterData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                        }
                        else if(userData[0].userData[0].role == 'agent'){
                            let agentData = await Sys.App.Services.UserServices.getOneByData({_id:userData[0].userData[0]._id})
                            console.log("agentData",agentData);
                            let masterData = await Sys.App.Services.UserServices.getOneByData({_id:userData[0].userData[0].userId})
                            console.log("masterData commission",masterData);
                            let grandMasterData = await Sys.App.Services.UserServices.getOneByData({_id:masterData.userId})
                            console.log("grandMasterData commission",grandMasterData);
                            let siteOwnerData = await Sys.App.Services.UserServices.getOneByData({_id:grandMasterData.userId})
                            console.log("siteOwnerData commission",siteOwnerData);
                            let adminData = await Sys.App.Services.UserServices.getOneByData({_id:siteOwnerData.userId})
                            console.log("adminData commission",adminData);
        
                            /*admin commission start*/
                            let commissionOfAdmin = 100 - siteOwnerData.totalCommission
                            let totalAmountOfAdminCommission = Number(afterCommission)*Number(commissionOfAdmin)/100
                            console.log("totalAmountOfAdminCommission",totalAmountOfAdminCommission);
        
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(adminData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfAdminCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:adminData.name,
                                role:adminData.role,
                                commission:commissionOfAdmin,
                                price:totalAmountOfAdminCommission,
                                userId:adminData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                            /*admin commission end*/
        
                            /*siteOwner commission start*/
                            let commissionOfSiteOwner = siteOwnerData.commission - grandMasterData.commission
                            console.log("commissionOfSiteOwner",commissionOfSiteOwner);
                            let totalAmountOfSiteOwnerCommission = Number(afterCommission)*Number(commissionOfSiteOwner)/100
                            console.log("totalAmountOfSiteOwnerCommission",totalAmountOfSiteOwnerCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(siteOwnerData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfSiteOwnerCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:siteOwnerData.name,
                                role:siteOwnerData.role,
                                commission:siteOwnerData.commission,
                                price:totalAmountOfSiteOwnerCommission,
                                userId:siteOwnerData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                            /*siteOwner commission end*/
        
        
                            /*grandMaster commission start*/
                            //grandMaster Commission
                            let commissionOfGrandMaster = grandMasterData.commission - masterData.commission
                            console.log("commissionOfGrandMaster",commissionOfGrandMaster);
                            let totalAmountOfGrandMasterCommission = Number(afterCommission)*Number(commissionOfGrandMaster)/100
                            console.log("totalAmountOfGrandMasterCommission",totalAmountOfGrandMasterCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(grandMasterData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfGrandMasterCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:grandMasterData.name,
                                role:grandMasterData.role,
                                commission:grandMasterData.commission,
                                price:totalAmountOfGrandMasterCommission,
                                userId:grandMasterData.userId,
                                createdBy:siteOwnerData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                            /*grandMaster commission end*/
        
                            /*master commission start*/
                            //master Commission
                            let commissionOfMaster =  masterData.commission - agentData.commission
                            console.log("commissionOfMaster",commissionOfMaster);
                            let totalAmountOfMasterCommission = Number(afterCommission)*Number(commissionOfMaster)/100
                            console.log("totalAmountOfMasterCommission",totalAmountOfMasterCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(masterData._id
                            )},{
                                $inc:{
                                    commissionAmount:-totalAmountOfMasterCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:masterData.name,
                                role:masterData.role,
                                commission:masterData.commission,
                                price:totalAmountOfMasterCommission,
                                userId:masterData.userId,
                                createdBy:grandMasterData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
        
                            /*master commission end*/
        
        
                            //agent Commission
                            let commissionOfAgent = agentData.commission
                            console.log("commissionOfAgent",commissionOfAgent,totalWinning);
                            let totalAmountOfAgentCommission = Number(afterCommission)*Number(commissionOfAgent)/100
                            console.log("totalAmountOfAgentCommission",totalAmountOfAgentCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(agentData._id)
                            },{
                                $inc:{
                                    commissionAmount:-totalAmountOfAgentCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:agentData.name,
                                role:agentData.role,
                                commission:agentData.commission,
                                price:totalAmountOfAgentCommission,
                                userId:agentData.userId,
                                createdBy:masterData.name,
                                transactionId:tranumber,
                                transactionType:'debit'
                            })
                        }
                    }
                    console.log("player winning",player);
                // }
            }
         
            result.totalWinning = totalWinning;
            console.log("in linesWithWinnings loop");

            var biggestWin = 0;
            history.forEach(function (chipData) {
                if (chipData.type == 'win') {
                    biggestWin = (biggestWin < chipData.quantity) ? chipData.quantity : biggestWin;
                }
            });
            if (player.statistics != null && player.statistics.hasOwnProperty('biggest_win')) {
                if (player.statistics.biggest_win < biggestWin) {
                    player.statistics.biggest_win = biggestWin;
                }
            } else {
                player.statistics = {};
                player.statistics.biggest_win = biggestWin;
            }
            var xp = (totalWinning) ? player.xp + 50 : player.xp + 10;
            let payout = await Sys.Game.Slot.Controllers.RoomProcess.checkForPayoutName(data, bet, totalWinning);
            console.log("in payout name query");
            xp = (payout) ? xp + 50 : xp;
            var level = await Sys.Game.Slot.Controllers.RoomProcess.checkLevel(xp);
            // console.log("room process addWinning --------------->>>",history)
            for (var h = 0; h < history.length; h++) {
                // if(history[h].type == 'win'){
                await Sys.Game.Slot.Services.ChipsTransactionService.create({
                    player: history[h].player,
                    gamePlayer: history[h].gamePlayer,
                    quantity: history[h].quantity,
                    bet: (history[h].bet) ? history[h].bet : 0,
                    remaining: history[h].remaining,
                    remark: history[h].remark,
                    type: history[h].type,
                    line: history[h].line,
                    spin: history[h].spin,
                });
                // }
            }
        
            // jackpot winning process start
            console.log('Before jackpot:', player.chips);
            let payColumns = ['payoutRatio', 'jackpotPlan', 'desiredIncomeRatio', 'totalInward', 'totalOutward', 'totalIncome', 'jackpotPlanIncome', 'jackpotWinningAt', 'desiredIncome', 'differenceIncome', 'differenceRatio'];
            let payouts = await Sys.Game.Slot.Services.SettingServices.findOne({}, payColumns);
            let jackpotWin = false;
            let jackpotAmount = 0;
            if (payouts.jackpotWinningAt != undefined && payouts.jackpotWinningAt > 0) {
                if (payouts.jackpotPlanIncome >= payouts.jackpotWinningAt) {
                    player.chips = convertFloatVal(parseFloat(player.chips) + parseFloat(payouts.jackpotPlanIncome))
                    jackpotAmount = payouts.jackpotPlanIncome;
                    let traNumber = +new Date();
                    console.log("player", player.user)
                    let admin = await Sys.Game.Slot.Services.UserService.getOneuser({ _id: player.user })
                    console.log("admin", admin)
                    await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
                        player: player.id,
                        game: lastSpin,
                        rackFromId: admin.id,
                        rackToId: player.id,
                        rackFrom: "admin",
                        rackTo: "player",
                        totalRack: eval(parseFloat(jackpotAmount).toFixed(4)),
                        createdAt: new Date(),
                        remark: "test",
                        transactionNumber: 'DE-' + traNumber,
                        rackToAfter_balance: 0,
                        rackToBefore_balance: jackpotAmount || 0,
                        jackpotChips: true,
                        type: "jackpot"
                    });
                    let payoutsUpdate = await Sys.Game.Slot.Services.SettingServices.update({
                        _id: payouts.id
                    }, {
                        $set: { jackpotPlanIncome: 0 }
                    });
                    if (payoutsUpdate instanceof Error) {
                        console.log("Error in Calculating Payout Data");
                    }
                    jackpotWin = true;
                }
            }
            console.log('After jackpot:', player.chips, jackpotAmount);
            // jackpot winning process end
            console.log("in history loop");
            let transaction = {
                player: player.id,
                gamePlayer: gamePlayer.id,
                jackpotAmount: jackpotAmount,
                quantity: totalWinning,
                remaining: player.chips,
                remark: (payout) ? 'winning in game :' + payout.name : 'winning in game',
                type: 'win',
                jackpotWin: jackpotWin
            };
            await Sys.Game.Slot.Services.PlayerServices.updatePlayer({
                _id: player.id
            }, {
                xp: xp,
                level: level.level,
                chips: player.chips,
                statistics: player.statistics
            });
            result.level = level;
            result.payout_name = (payout) ? payout.name : null;
            transaction.level = level;
            let resultSearch = await Sys.Game.Slot.Controllers.RoomProcess.searchFreeSpin(data, lines, result);
            result = resultSearch;
            let game_player = await Sys.Game.Slot.Services.GameServices.getOneByDataGamePlayer({ _id: transaction.gamePlayer });
            transaction.free_spin = result.free_spin;
            /* if (payout && bet) {
              if (bet.jackpot_eligible && payout.jackpot_eligible) {
                await Sys.Game.Slot.Controllers.RoomProcess.checkForRoomJackpotDistribution(game_player, player);
              }
            } */
            await Sys.Io.of(Sys.Config.Namespace.Slot).to(data.room).emit('PlayerWin', {
                roomNo: data.room,
                thems: game_player.theme,
                transaction: transaction,
                data: data
            });
            console.log('free_spin', result.free_spin);

            // Calculate Payout Management Data
            let totalBetAmount = bet * data.lines;
            Sys.Game.Slot.Controllers.RoomProcess.calcPayoutData(totalBetAmount, totalWinning, player, lastSpin);

            return {
                status: 'success',
                message: 'Spin success.',
                result: result
            }
        } catch (error) {
            console.log('Catched Error in recAddWinningChips :', error);
            return new Error('Error in recAddWinningChips');
        }
    },

    calcPayoutData: async function (bet, win, player, gameId) {
        try {
            console.log(" bet, win :", bet, win);
            let payColumns = ['payoutRatio', 'jackpotPlan', 'desiredIncomeRatio', 'totalInward', 'totalOutward', 'totalIncome', 'jackpotPlanIncome', 'desiredIncome', 'differenceIncome', 'differenceRatio'];
            let payouts = await Sys.Game.Slot.Services.SettingServices.findOne({}, payColumns);
            console.log("payouts", payouts);
            let jackpotIncome = convertFloatVal(bet * payouts.jackpotPlan / 100);
            let totalInward = convertFloatVal(payouts.totalInward + bet);
            let totalOutward = convertFloatVal(payouts.totalOutward + win);
            let totalIncome = convertFloatVal(totalInward - totalOutward);
            let rakeAmount = convertFloatVal(bet * payouts.desiredIncomeRatio / 100);
            console.log("maulikRack",bet * payouts.desiredIncomeRatio / 100);
            // let desiredIncome = convertFloatVal(totalInward * payouts.desiredIncomeRatio / 100);
            console.log("rakeAmount",rakeAmount);
            let desiredIncome = convertFloatVal(((payouts.desiredIncome > 0) ? payouts.desiredIncome : 0) + rakeAmount);
            let jackpotPlanIncome = convertFloatVal(((payouts.jackpotPlanIncome > 0) ? payouts.jackpotPlanIncome : 0) + jackpotIncome);
            let differenceIncome = convertFloatVal(totalIncome - desiredIncome);
            let differenceRatio = convertFloatVal(Number(differenceIncome) / Number(desiredIncome) * 100);
            console.log("Payout Data : ", {
                totalInward,
                totalOutward,
                totalIncome,
                desiredIncome,
                jackpotPlanIncome,
                differenceIncome,
                differenceRatio
            });

            let tranumber =+ new Date()
            await Sys.Game.Slot.Services.SettingServices.createSelfRport({
                totalInward: bet,
                totalOutward: win,
                totalIncome: bet - win,
                desiredChipsIncome: rakeAmount,
                transactionId: tranumber
            })

            let payoutsUpdate = await Sys.Game.Slot.Services.SettingServices.update({
                _id: payouts.id
            }, {
                totalInward: totalInward,
                totalOutward: totalOutward,
                totalIncome: totalIncome,
                desiredIncome: desiredIncome,
                jackpotPlanIncome: jackpotPlanIncome,
                differenceIncome: differenceIncome,
                differenceRatio: differenceRatio
            });
            if(player.isGuestPlayer==false){
            let traNumber = +new Date();
            console.log("admin",typeof(player.user));
            console.log("admin",player.user);
            let admin = await Sys.Game.Slot.Services.UserService.getOneuser({ _id: player.user })
            console.log("admin",admin);
            await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
                player: player.id,
                game: gameId,
                rackFromId: player.id,
                rackToId: admin.id,
                rackFrom: "player",
                rackTo: "admin",
                rackPercent: payouts.jackpotPlan,
                totalRack: eval(parseFloat(jackpotIncome).toFixed(4)),
                createdAt: new Date(),
                transactionNumber: 'DEP-' + traNumber,
                rackToAfter_balance: jackpotPlanIncome,
                rackToBefore_balance: payouts.jackpotPlanIncome || 0,
                jackpotChips: true,
                type: "jackpot"
            });
            traNumber = +new Date();
            await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
                player: player._id,
                game: gameId,
                rackFromId: player._id,
                rackToId: admin._id,
                rackFrom: "player",
                rackTo: "admin",
                rackPercent: payouts.desiredIncomeRatio,
                totalRack: eval(parseFloat(rakeAmount).toFixed(4)),
                createdAt: new Date(),
                transactionNumber: 'DEP-' + traNumber,
                rackToAfter_balance: payouts.desiredIncome + rakeAmount,
                rackToBefore_balance: payouts.desiredIncome,
                rakeChips: true,
                type: "rake",
                chips: bet,
                won: win
            });
          
            if(bet > 0){
                let totalLoss = bet
                // let tranumber =+ new Date()
                // let query = [{ $match: {player: ObjectId(player.id) } },
                // {
                //     $lookup: {
                //         from: 'chipstransaction',
                //         localField: '_id',
                //         foreignField: 'gamePlayer',
                //         as: 'chipTransactionData'
                // }
                // }, { $unwind: '$chipTransactionData' },
                // {
                //     $match: { $and: [{ 'chipTransactionData.type': 'bet' }, { 'chipTransactionData.isDeleted': false }] }
                // }, {
                //     $group: {
                //         _id: "",
                //         total: { $sum: "$chipTransactionData.quantity" },
                //     }
                // },
                // {
                //     $project: {
                //        total: 1,
                //     }
                // }]
                // let data1 = await Sys.App.Services.GameService.getBetHistoryLookupData(query);
                // if(data1.length){
                //      totalLoss = data1[0].total 
                // }
                console.log("totalLoss",totalLoss);
                let userQuery = [{ $match: { _id: ObjectId(player.id),isGuestPlayer:false } }, {
                    $lookup: {
                        from: 'user',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userData'
                    }
                }]
                let userData = await Sys.App.Services.PlayerServices.getPlayerDataLookupAggregate(userQuery);
                console.log("userData", userData[0].userData[0].commission);
                    
                if(userData){
                    if (userData[0].userData[0].role == "admin"){
                        await Sys.App.Services.UserServices.updateUserData({_id:ObjectId(userData[0].userData[0]._id)},{$inc:{commissionAmount:totalLoss}})
                           
                        await Sys.App.Services.GameService.updateChipsTransaction({player: ObjectId(userData[0]._id),type:'loss'},{$set:{isDeleted:true}})
                        await Sys.App.Services.UserServices.createCommission({name:userData[0].userData[0].name,role:userData[0].userData[0].role,commission:100,price:totalLoss,transactionId:tranumber,transactionType:'credit'})
                    }
                    else if(userData[0].userData[0].role == "agent"){
                        let agentData = await Sys.App.Services.UserServices.getOneByData({_id:userData[0].userData[0]._id})
                        console.log("agentData",agentData);
                        let masterData = await Sys.App.Services.UserServices.getOneByData({_id:userData[0].userData[0].userId})
                        console.log("masterData commission",masterData);
                            let grandMasterData = await Sys.App.Services.UserServices.getOneByData({_id:masterData.userId})
                            console.log("grandMasterData commission",grandMasterData);
                            let siteOwnerData = await Sys.App.Services.UserServices.getOneByData({_id:grandMasterData.userId})
                            console.log("siteOwnerData commission",siteOwnerData);
                            let adminData = await Sys.App.Services.UserServices.getOneByData({_id:siteOwnerData.userId})
                            console.log("adminData commission",adminData);
        
                            /*admin commission start*/
                            let commissionOfAdmin = 100 - siteOwnerData.totalCommission
                            let totalAmountOfAdminCommission = Number(totalLoss)*Number(commissionOfAdmin)/100
                            console.log("totalAmountOfAdminCommission",totalAmountOfAdminCommission);
        
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(adminData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfAdminCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:adminData.name,
                                role:adminData.role,
                                commission:commissionOfAdmin,
                                price:totalAmountOfAdminCommission,
                                userId:adminData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            /*admin commission end*/
        
                            /*siteOwner commission start*/
                            let commissionOfSiteOwner = siteOwnerData.commission - grandMasterData.commission
                            console.log("commissionOfSiteOwner",commissionOfSiteOwner);
                            let totalAmountOfSiteOwnerCommission = Number(totalLoss)*Number(commissionOfSiteOwner)/100
                            console.log("totalAmountOfSiteOwnerCommission",totalAmountOfSiteOwnerCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(siteOwnerData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfSiteOwnerCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:siteOwnerData.name,
                                role:siteOwnerData.role,
                                commission:siteOwnerData.commission,
                                price:totalAmountOfSiteOwnerCommission,
                                userId:siteOwnerData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            /*siteOwner commission end*/
        
        
                            /*grandMaster commission start*/
                            //grandMaster Commission
                            let commissionOfGrandMaster = grandMasterData.commission - masterData.commission
                            console.log("commissionOfGrandMaster",commissionOfGrandMaster);
                            let totalAmountOfGrandMasterCommission = Number(totalLoss)*Number(commissionOfGrandMaster)/100
                            console.log("totalAmountOfGrandMasterCommission",totalAmountOfGrandMasterCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(grandMasterData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfGrandMasterCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:grandMasterData.name,
                                role:grandMasterData.role,
                                commission:grandMasterData.commission,
                                price:totalAmountOfGrandMasterCommission,
                                userId:grandMasterData.userId,
                                createdBy:siteOwnerData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            /*grandMaster commission end*/
        
                            /*master commission start*/
                            //master Commission
                            let commissionOfMaster =  masterData.commission - agentData.commission
                            console.log("commissionOfMaster",commissionOfMaster);
                            let totalAmountOfMasterCommission = Number(totalLoss)*Number(commissionOfMaster)/100
                            console.log("totalAmountOfMasterCommission",totalAmountOfMasterCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(masterData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfMasterCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:masterData.name,
                                role:masterData.role,
                                commission:masterData.commission,
                                price:totalAmountOfMasterCommission,
                                userId:masterData.userId,
                                createdBy:grandMasterData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
        
                            /*master commission end*/
        
        
                            //agent Commission
                            let commissionOfAgent = agentData.commission
                            console.log("commissionOfAgent",commissionOfAgent);
                            let totalAmountOfAgentCommission = Number(totalLoss)*Number(commissionOfAgent)/100
                            console.log("totalAmountOfAgentCommission",totalAmountOfAgentCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(agentData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfAgentCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:agentData.name,
                                role:agentData.role,
                                commission:agentData.commission,
                                price:totalAmountOfAgentCommission,
                                userId:agentData.userId,
                                createdBy:masterData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            await Sys.App.Services.GameService.updateChipsTransaction({player: ObjectId(userData[0]._id),type:'bet'},{$set:{isDeleted:true}})
                        }
                        else if(userData[0].userData[0].role == "master"){
                            let masterData = await Sys.App.Services.UserServices.getOneByData({_id:userData[0].userData[0]._id})
                            console.log("masterData commission",masterData);
                            let grandMasterData = await Sys.App.Services.UserServices.getOneByData({_id:masterData.userId})
                            console.log("grandMasterData commission",grandMasterData);
                            let siteOwnerData = await Sys.App.Services.UserServices.getOneByData({_id:grandMasterData.userId})
                            console.log("siteOwnerData commission",siteOwnerData);
                            let adminData = await Sys.App.Services.UserServices.getOneByData({_id:siteOwnerData.userId})
                            console.log("adminData commission",adminData);
        
                            /*admin commission start*/
                            let commissionOfAdmin = 100 - siteOwnerData.totalCommission
                            console.log("commissionOfAdmin",commissionOfAdmin);
                            let totalAmountOfAdminCommission = Number(totalLoss) * Number(commissionOfAdmin)/100
                            console.log("totalAmountOfAdminCommission",totalAmountOfAdminCommission);
        
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(adminData._id)
                            },{
                                $inc:{
                                    commissionAmount:totalAmountOfAdminCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:adminData.name,
                                role:adminData.role,
                                commission:commissionOfAdmin,
                                price:totalAmountOfAdminCommission,
                                userId:adminData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            /*admin commission end*/
        
                            /*siteOwner commission start*/
                            let commissionOfSiteOwner = siteOwnerData.commission - grandMasterData.commission
                            console.log("commissionOfSiteOwner",commissionOfSiteOwner);
                            let totalAmountOfSiteOwnerCommission = Number(totalLoss)*Number(commissionOfSiteOwner)/100
                            console.log("totalAmountOfSiteOwnerCommission",totalAmountOfSiteOwnerCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(siteOwnerData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfSiteOwnerCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:siteOwnerData.name,
                                role:siteOwnerData.role,
                                commission:siteOwnerData.commission,
                                price:totalAmountOfSiteOwnerCommission,
                                userId:siteOwnerData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            /*siteOwner commission end*/
        
        
                            /*grandMaster commission start*/
                            //grandMaster Commission
                            let commissionOfGrandMaster = grandMasterData.commission - masterData.commission
                            console.log("commissionOfGrandMaster",commissionOfGrandMaster);
                            let totalAmountOfGrandMasterCommission = Number(totalLoss)*Number(commissionOfGrandMaster)/100
                            console.log("totalAmountOfGrandMasterCommission",totalAmountOfGrandMasterCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(grandMasterData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfGrandMasterCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:grandMasterData.name,
                                role:grandMasterData.role,
                                commission:grandMasterData.commission,
                                price:totalAmountOfGrandMasterCommission,
                                userId:grandMasterData.userId,
                                createdBy:siteOwnerData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            /*grandMaster commission end*/
        
                            /*master commission start*/
                            //master Commission
                            let commissionOfMaster =  masterData.commission 
                            console.log("commissionOfMaster",commissionOfMaster);
                            let totalAmountOfMasterCommission = Number(totalLoss)*Number(commissionOfMaster)/100
                            console.log("totalAmountOfMasterCommission",totalAmountOfMasterCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(masterData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfMasterCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:masterData.name,
                                role:masterData.role,
                                commission:masterData.commission,
                                price:totalAmountOfMasterCommission,
                                userId:masterData.userId,
                                createdBy:grandMasterData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
        
                            /*master commission end*/
                            await Sys.App.Services.GameService.updateChipsTransaction({player: ObjectId(userData[0]._id),type:'bet'},{$set:{isDeleted:true}})
        
                          
        
        
                        }
                        else if(userData[0].userData[0].role == "grand-master"){
        
                            let grandMasterData = await Sys.App.Services.UserServices.getOneByData({_id:userData[0].userData[0]._id})
                            console.log("grandMasterData commission",grandMasterData);
                            let siteOwnerData = await Sys.App.Services.UserServices.getOneByData({_id:grandMasterData.userId})
                            console.log("siteOwnerData commission",siteOwnerData);
                            let adminData = await Sys.App.Services.UserServices.getOneByData({_id:siteOwnerData.userId})
                            console.log("adminData commission",adminData);
                           
        
                            /*admin commission start*/
                            let commissionOfAdmin = 100 - siteOwnerData.totalCommission
                            let totalAmountOfAdminCommission = Number(totalLoss)*Number(commissionOfAdmin)/100
                            console.log("totalAmountOfAdminCommission",totalAmountOfAdminCommission);
        
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(adminData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfAdminCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:adminData.name,
                                role:adminData.role,
                                commission:commissionOfAdmin,
                                price:totalAmountOfAdminCommission,
                                userId:adminData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            /*admin commission end*/
        
                            /*siteOwner commission start*/
                            let commissionOfSiteOwner = siteOwnerData.commission - grandMasterData.commission
                            console.log("commissionOfSiteOwner",commissionOfSiteOwner);
                            let totalAmountOfSiteOwnerCommission = Number(totalLoss)*Number(commissionOfSiteOwner)/100
                            console.log("totalAmountOfSiteOwnerCommission",totalAmountOfSiteOwnerCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(siteOwnerData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfSiteOwnerCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:siteOwnerData.name,
                                role:siteOwnerData.role,
                                commission:siteOwnerData.commission,
                                price:totalAmountOfSiteOwnerCommission,
                                userId:siteOwnerData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            /*siteOwner commission end*/
        
        
                            /*grandMaster commission start*/
                            //grandMaster Commission
                            let commissionOfGrandMaster = grandMasterData.commission
                            console.log("commissionOfGrandMaster",commissionOfGrandMaster);
                            let totalAmountOfGrandMasterCommission = Number(totalLoss)*Number(commissionOfGrandMaster)/100
                            console.log("totalAmountOfGrandMasterCommission",totalAmountOfGrandMasterCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(grandMasterData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfGrandMasterCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:grandMasterData.name,
                                role:grandMasterData.role,
                                commission:grandMasterData.commission,
                                price:totalAmountOfGrandMasterCommission,
                                userId:grandMasterData.userId,
                                createdBy:siteOwnerData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            /*grandMaster commission end*/
        
                            await Sys.App.Services.GameService.updateChipsTransaction({player: ObjectId(userData[0]._id),type:'bet'},{$set:{isDeleted:true}})
        
        
                        }
                        else if(userData[0].userData[0].role == "site-owner"){
                            let siteOwnerData = await Sys.App.Services.UserServices.getOneByData({_id:userData[0].userData[0]._id})
                            console.log("siteOwnerData commission",siteOwnerData);
                            let adminData = await Sys.App.Services.UserServices.getOneByData({_id:siteOwnerData.userId})
                            console.log("adminData commission",adminData);
        
                            /*admin commission start*/
                            let commissionOfAdmin = 100 - siteOwnerData.totalCommission
                            let totalAmountOfAdminCommission = Number(totalLoss)*Number(commissionOfAdmin)/100
                            console.log("totalAmountOfAdminCommission",totalAmountOfAdminCommission);
        
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(adminData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfAdminCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:adminData.name,
                                role:adminData.role,
                                commission:commissionOfAdmin,
                                price:totalAmountOfAdminCommission,
                                userId:adminData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            /*admin commission end*/
        
                            /*siteOwner commission start*/
                            let commissionOfSiteOwner = siteOwnerData.commission 
                            console.log("commissionOfSiteOwner",commissionOfSiteOwner);
                            let totalAmountOfSiteOwnerCommission = Number(totalLoss)*Number(commissionOfSiteOwner)/100
                            console.log("totalAmountOfSiteOwnerCommission",totalAmountOfSiteOwnerCommission);
                            
                            //update commission amount
                            await Sys.App.Services.UserServices.updateUserData({
                                _id:ObjectId(siteOwnerData._id
                            )},{
                                $inc:{
                                    commissionAmount:totalAmountOfSiteOwnerCommission
                                }
                            })
        
                            //create commission
                            await Sys.App.Services.UserServices.createCommission({
                                name:siteOwnerData.name,
                                role:siteOwnerData.role,
                                commission:siteOwnerData.commission,
                                price:totalAmountOfSiteOwnerCommission,
                                userId:siteOwnerData.userId,
                                createdBy:adminData.name,
                                transactionId:tranumber,
                                transactionType:'credit'
                            })
                            /*siteOwner commission end*/
                            await Sys.App.Services.GameService.updateChipsTransaction({player: ObjectId(userData[0]._id),type:'bet'},{$set:{isDeleted:true}})
            
                    
        
                      }
        
                      
                    }
                }
            }
            if (payoutsUpdate instanceof Error) {
                console.log("Error in Calculating Payout Data");
            }
        } catch (error) {
            console.log('Catched Error in calcPayoutData :', error);
        }
    },

    getSpinReelsPayout: async function (player, gamePlayer, bet, game, free, remainingChips, lastSpin, data, allSpinData) {
        try {
            console.log("maulikLog");
            var matrix = {};
            var reels = {
                reel_one: [],
                reel_two: [],
                reel_three: [],
                reel_four: [],
                reel_five: []
            };
            let symbolReels = await Sys.Game.Slot.Services.SymbolReelServices.getBySymbolReels({ game: data.id });
            symbolReels = JSON.stringify(symbolReels);
            symbolReels = JSON.parse(symbolReels);

            for (var s = 0; s < symbolReels.length; s++) {
                let symbol = await Sys.Game.Slot.Services.SymbolServices.getOneSymbol({ _id: symbolReels[s].symbol })
                let reel = await Sys.Game.Slot.Services.ReelServices.getOneReel({ _id: symbolReels[s].reel })

                symbolReels[s].symbol = symbol;
                symbolReels[s].reel = reel;
            }
            var newreels = {};
            symbolReels.forEach(async function (symbolReel) {
                // console.log("reels data <<===============>>",symbolReel);
                if (newreels[symbolReel.reel]) {
                    await Sys.Game.Slot.Controllers.RoomProcess.addSymbolToReel(newreels[symbolReel.reel], symbolReel.symbol, symbolReel.count);
                } else {
                    newreels[symbolReel.reel] = [];
                    await Sys.Game.Slot.Controllers.RoomProcess.addSymbolToReel(newreels[symbolReel.reel], symbolReel.symbol, symbolReel.count);
                }
            });

            let lines = await Sys.Game.Slot.Services.SlotGameServices.getByLine({ game: data.id });
            console.log("maulik", lines);
            if (lines instanceof Error) {
                return { status: 'fail', result: null, message: lines.message, statusCode: 401 }
            }
            let symbols = await Sys.Game.Slot.Services.SlotGameServices.getSymbol({ symbol_type: 'symbol', game: data.id });
            if (symbols instanceof Error) {
                return { status: 'fail', result: null, message: symbols.message, statusCode: 401 }
            }
            let wild = await Sys.Game.Slot.Services.SlotGameServices.getOneSymbol({ symbol_type: 'wild', game: data.id });
            if (wild instanceof Error) {
                return { status: 'fail', result: null, message: wild.message, statusCode: 401 }
            }



            let addWinning = {};
            // start Here

            console.log("start myFunction");
            for (let i = 0; i != -1; i++) {

                var tempReal = [];
                for (const key in newreels) {
                    if (newreels.hasOwnProperty(key)) {
                        await Sys.Game.Slot.Controllers.RoomProcess.shuffle(newreels[key]);
                    }
                }
                for (const key in newreels) {
                    if (newreels.hasOwnProperty(key)) {
                        const element = newreels[key];
                        tempReal.push(element);
                    }
                }

                combinations = [];
                let index = {
                    reel_one: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[0].length),
                    reel_two: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[1].length),
                    reel_three: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, tempReal[2].length),
                    reel_four: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, data.id != '5bd9b169afdd62126b1b848f' ? tempReal[3].length : null),
                    reel_five: await Sys.Game.Slot.Controllers.RoomProcess.getRandomIntInclusive(0, data.id != '5bd9b169afdd62126b1b848f' ? tempReal[4].length : null),
                }

                for (let i = 0; i < 4; i++) {
                    if (index.reel_one == tempReal[0].length) {
                        index.reel_one = 0;
                    }
                    if (index.reel_two == tempReal[1].length) {
                        index.reel_two = 0;
                    }
                    if (index.reel_three == tempReal[2].length) {
                        index.reel_three = 0;
                    }
                    if (data.id != '5bd9b169afdd62126b1b848f' && index.reel_four == tempReal[3].length) {
                        index.reel_four = 0;
                    }
                    if (data.id != '5bd9b169afdd62126b1b848f' && index.reel_five == tempReal[4].length) {
                        index.reel_five = 0;
                    }

                    combinations.push({
                        reel_one: tempReal[0][index.reel_one].id,
                        reel_two: tempReal[1][index.reel_two].id,
                        reel_three: tempReal[2][index.reel_three].id,
                        reel_four: data.id != '5bd9b169afdd62126b1b848f' ? tempReal[3][index.reel_four].id : '',
                        reel_five: data.id != '5bd9b169afdd62126b1b848f' ? tempReal[4][index.reel_five].id : '',
                    });
                    index.reel_one++;
                    index.reel_two++;
                    index.reel_three++;
                    if (index.reel_four != null) {
                        index.reel_four++;
                    }
                    if (index.reel_five != null) {
                        index.reel_five++;
                    }
                }
                combinations.forEach(function (combination, key) {
                    var keyPrefix = key + 1;
                    matrix['m' + keyPrefix + 1] = combination.reel_one;
                    matrix['m' + keyPrefix + 2] = combination.reel_two;
                    matrix['m' + keyPrefix + 3] = combination.reel_three;
                    matrix['m' + keyPrefix + 4] = combination.reel_four;
                    matrix['m' + keyPrefix + 5] = combination.reel_five;
                    reels.reel_one.push(combination.reel_one);
                    reels.reel_two.push(combination.reel_two);
                    reels.reel_three.push(combination.reel_three);
                    reels.reel_four.push((combination.reel_four) ? combination.reel_four : '');
                    reels.reel_five.push((combination.reel_five) ? combination.reel_five : '');
                });

                let searchResult = [];
                let linesMatrix = [];
                let history = [];
                lines = JSON.stringify(lines);
                lines = JSON.parse(lines);
                lines.forEach(function (line) {
                    let remark = 'bet on game5';
                    if (data.bonus == 1) {
                        remark = 'bonus spin';
                    }
                    if (!free) {
                        remainingChips = remainingChips - bet.chips;
                    }

                    history.push({
                        player: player.id,
                        gamePlayer: gamePlayer.id,
                        quantity: free ? 0 : bet.chips,
                        remaining: remainingChips,
                        remark: remark,
                        type: 'bet',
                        line: line.id,
                        spin: parseInt(lastSpin) + 1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });

                    var row = [];
                    for (let row_id in line.matrix) {
                        for (let column_id in line.matrix[row_id]) {
                            if (line.matrix[row_id][column_id]) {
                                row.push({ row: row_id, col: column_id });
                            }
                        }
                    }
                    row.sort(function (a, b) { return (a.col > b.col) ? 1 : ((b.col > a.col) ? -1 : 0); });
                    var rowData = [];
                    game.rows.forEach(function (row) {
                        rowData.push(row.id);
                    });
                    var cols = [];
                    game.reels.forEach(function (reel) {
                        cols.push(reel.id);
                    });
                    row.forEach(function (cell) {
                        var rowIndex = rowData.indexOf(cell.row) + 1;
                        var colIndex = cols.indexOf(cell.col) + 1;
                        line[`m${rowIndex}${colIndex}`] = true;
                    });
                    var lineTemp = '';
                    var lineTempArray = [];
                    for (var j = 1; j < 6; j++) {
                        for (var i = 1; i < 5; i++) {
                            var key = 'm' + i + j;
                            if (line[key] == true) {
                                lineTemp += String("ADGKZ" + String(matrix[key])).slice(-5);
                                lineTempArray.push(String("ADGKZ" + String(matrix[key])).slice(-5));
                            }
                        }
                    }

                    linesMatrix.push(lineTemp);
                    var symbolCounts = [];

                    if (wild) {
                        var wildSearchString = String("ADGKZ" + String(wild.id)).slice(-5);
                    }
                    // This code is for left to right combination for big slots and reverted code for small slot
                    symbols.forEach(async function (symbol) {
                        var searchString = String("ADGKZ" + String(symbol.id)).slice(-5);
                        if (data.id == '5bd9b169afdd62126b1b848f') {
                            var count = (lineTemp.match(new RegExp(searchString, "g")) || []).length;
                            var symbolCount = 0;
                            switch (count) {
                                case 3:
                                    symbolCount = 3;
                                    break;
                                case 2:
                                    symbolCount = 2;
                                    break;
                                case 1:
                                    symbolCount = 1;
                            }
                        } else {
                            var symbolCount = await Sys.Game.Slot.Controllers.RoomProcess.searchSymbole(searchString, wild ? wildSearchString : null, lineTempArray);
                        }

                        if (symbolCount == 1) {
                            if (data.id == '5bd9b169afdd62126b1b848f') {
                                symbolCount = 1;
                            } else {
                                // symbolCount = symbolCount
                                symbolCount = 0;
                            }
                        }
                        if (symbolCount > 0) {
                            symbolCounts.push({ symbol_id: symbol.id, count: symbolCount });
                        }
                    });
                    searchResult.push({ line_id: line.id, symbolCounts: symbolCounts });
                });

                var result = {
                    matrix: reels,
                    searchResult: searchResult
                };

                let payouts = await Sys.Game.Slot.Services.SymbolReelServices.getSymbolPayout({ game: data.id });
                if (payouts instanceof Error) {
                    return { status: 'fail', result: null, message: payouts.message, statusCode: 401 }
                }

                addWinning = await Sys.Game.Slot.Controllers.RoomProcess.recAddWinningChips(payouts, bet, linesMatrix, player, gamePlayer, result, history, lastSpin, data, allSpinData);

                console.log("AddWinning : ", i, addWinning.result.totalWinning)

                if (addWinning.result.totalWinning < 430 && addWinning.result.totalWinning > 410) break;

            }
            console.log("ends myFunction");
            return addWinning;


            // End here

            // return addWinning;


        } catch (error) {
            console.log('Catched Error in recSpinReels :', error);
            return new Error('Error in recSpinReels');
        }
    },




}

function convertFloatVal(value) {
    let newValue = parseFloat(value).toFixed(2);
    newValue = parseFloat(newValue);
    return newValue;
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
        Sys.Log.info('Error in shuffle : ' + error);
        return new Error('Error in shuffle');
    }
}