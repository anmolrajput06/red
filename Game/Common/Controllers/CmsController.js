var Sys = require('../../../Boot/Sys');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var moment = require('moment');
var helper = require('../../../Helper/helper');

module.exports = {

    // registerDevice: async function(socket, data) {
    //     try {
    //         let player = await Sys.Game.Common.Services.PlayerServices.getOneByData({ device: data.device });
    //         if (player instanceof Error) {
    //             return { status: 'fail', result: null, message: player.message, statusCode: 401 }
    //         }
    //         if (!player) {

    //             data.status = 'active';
    //             data.socketId = '';
    //             data.device_id = helper.randomString(36);
    //             data.isFbLogin = false;

    //             let plr = await Sys.Game.Common.Services.PlayerServices.create(data);
    //             if (plr instanceof Error) {
    //                 return { status: 'fail', result: null, message: plr.message, statusCode: 401 }
    //             }
    //             plr.level = checkLevel(plr.xp);
    //             return {
    //                 status: 'success',
    //                 result: plr,
    //                 message: 'Device registerd successfully.',
    //             }
    //         }
    //         player.level = checkLevel(player.xp);
    //         return {
    //             status: 'success',
    //             result: player,
    //             message: 'Device already registerd.'
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },

    // playerRegister: async function(socket, data) {
    //     try {
    //         // Check Username & Email Already Avilable
    //         // let player = await Sys.Game.Common.Services.PlayerServices.getOneByData({ email: data.email });
    //         // console.log("data", data);
    //         // console.log("player", player);
    //         // if (player) { // When Player Found
    //         //     return {
    //         //         status: 'fail',
    //         //         result: null,
    //         //         message: 'Username already taken.',
    //         //         statusCode: 401
    //         //     }
    //         // }

    //         // Check Username & Email Already Avilable
    //         let playerEmail = await Sys.Game.Common.Services.PlayerServices.getOneByData({ email: data.email, deleted: false });
    //         let playerUsername = await Sys.Game.Common.Services.PlayerServices.getOneByData({ username: data.username, deleted: false });
    //         if (playerUsername) {
    //             console.log('Username already taken.');
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Username already taken.',
    //                 statusCode: 401
    //             }
    //         }
    //         if (playerEmail) { // When Player Found
    //             console.log('Email already taken.');
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Email already taken.',
    //                 statusCode: 401
    //             }
    //         }

    //         // Create Player Object
    //         let playerObj = {
    //             // device: data.device,
    //             device_id: data.deviceId,
    //             username: data.username,
    //             email: data.email,
    //             password: bcrypt.hashSync(data.password, 10),
    //             // ip: data.ip,
    //             // isFbLogin: false,
    //             // avatar: 'default.png',
    //             // firstname: data.firstname,
    //             // lastname: data.lastname,
    //             chips: 0,
    //             diamonds: 0,
    //             cash: 0,
    //             status: 'active',
    //             device_os: data.os,
    //             appVersion: data.appVersion,
    //             referralCode: data.referralCode,
    //             // socketId: ''
    //             // socketId : socket.id
    //         }
    //         let playerData = await Sys.Game.Common.Services.PlayerServices.create(playerObj);
    //         console.log("playerData", playerData);
    //         if (!playerData) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Player Not Created',
    //                 statusCode: 400
    //             }
    //         }
    //         if (playerData) {
    //             await Sys.Game.Common.Services.SocketServices.create({
    //                 playerId: playerData.id,
    //                 socketId: ""
    //             });

    //         }
    //         return {
    //             status: 'success',
    //             result: {
    //                 playerId: playerData.id,
    //                 username: playerData.username,
    //                 chips: playerData.chips,
    //                 cash: '0',
    //             },
    //             message: 'User registration successfully!'
    //         }
    //     } catch (error) {
    //         Sys.Log.info('Error in create Player : ' + error);
    //     }
    // },
    // playerLogin: async function(socket, data) {
    //     console.log("socket", socket.id);
    //     try {
    //         // data.isFbLogin = false;
    //         let passwordTrue = false;
    //         let playerObj = {}
    //             // let player = null;
    //             // if (data.isFbLogin == false) { // if Normal Login
    //             // Define Validation Rules
    //         var criteria = (data.username.indexOf('@') === -1) ? { username: data.username } : { email: data.username };
    //         console.log("criteria", criteria.email);
    //         let playerData = await Sys.Game.Common.Services.PlayerServices.getOneByData(criteria);
    //         if (playerData) {
    //             if (bcrypt.compareSync(data.password, playerData.password)) {
    //                 console.log("yes");
    //                 playerObj = {
    //                     // device_id: data.deviceId,
    //                     // username: criteria.username,
    //                     // password: bcrypt.hashSync(data.password, 10),
    //                     device_os: data.os,
    //                     appVersion: data.appVersion,

    //                     // isFbLogin : false,
    //                     $or: [
    //                         { username: criteria.username },
    //                         { email: criteria.email }
    //                     ]
    //                 };
    //             } else {
    //                 return {
    //                     status: 'fail',
    //                     result: null,
    //                     message: 'Invalid credentials!',
    //                     statusCode: 400
    //                 }
    //             }
    //         } else {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Invalid credentials!',
    //                 statusCode: 400
    //             }
    //         }
    //         console.log("playerObj", playerObj);

    //         let player = await Sys.Game.Common.Services.PlayerServices.getOneByData(playerObj);
    //         console.log("player", player);
    //         if (!player) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Player Not Found',
    //                 statusCode: 400
    //             }
    //         }

    //         let socketData = await Sys.Game.Common.Services.SocketServices.getByPlayerID({ playerId: player.id })
    //         if (socketData.socketId != '') {
    //             if (data.forceLogin == true) {
    //                 passwordTrue = true
    //             } else {
    //                 return {
    //                     status: 'fail',
    //                     result: null,
    //                     message: 'alreadyLogin',
    //                     statusCode: 400

    //                 }
    //             }

    //         }

    //         passwordTrue = true;
    //         // } else {

    //         //     let playerObj = {
    //         //         isFbLogin: true,
    //         //         appId: data.appId
    //         //     };

    //         //     player = await Sys.Game.Common.Services.PlayerServices.getOneByData(playerObj);

    //         //     if (!player) {

    //         //         playerObj = {
    //         //             device: data.device,
    //         //             isFbLogin: true,
    //         //             username: data.username,
    //         //             appId: data.appId,
    //         //             deviceId: data.deviceId,
    //         //             ip: data.ip,
    //         //             cash: 0,
    //         //             chips: Sys.Config.Rummy.defualtPrcticesChip,
    //         //             status: 'active'
    //         //         }

    //         //         player = await Sys.Game.Common.Services.PlayerServices.create(playerObj);
    //         //         if (!player) {
    //         //             return {
    //         //                 status: 'fail',
    //         //                 result: null,
    //         //                 message: 'Player Not Created',
    //         //                 statusCode: 400
    //         //             }
    //         //         }
    //         //     }
    //         //     passwordTrue = true;
    //         // }

    //         if (passwordTrue) {

    //             // player.isFbLogin = false;
    //             // if (data.AppId != '') {
    //             //     player.isFbLogin = true;
    //             // }
    //             let theme = await Sys.Game.Common.Services.PlayerServices.getThemeData({}, { _id: 1, theme_icon: 1, name: 1 })
    //             let themeData = []
    //             for (let i = 0; i < theme.length; i++) {
    //                 themeData.push({ id: theme[i]._id, name: theme[i].name, theme_icon: "/uploads/" + theme[i].theme_icon })
    //             }
    //             console.log(themeData);
    //             let socketIdData = await Sys.Game.Common.Services.SocketServices.update({
    //                 playerId: player.id,

    //             }, { socketId: socket.id });
    //             console.log(socketIdData);
    //             return {
    //                 status: 'success',
    //                 result: {
    //                     playerId: player.id,
    //                     username: player.username,
    //                     chips: player.chips,
    //                     cash: player.cash,
    //                     avatar: player.avatar,
    //                     email: playerData.email,
    //                     isGuestPlayer: playerData.isGuestPlayer,
    //                     thumbnailList: themeData
    //                 },
    //                 message: 'Player Successfully Login!'
    //             }
    //             //}
    //         } else {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Invalid credentials!',
    //                 statusCode: 401
    //             }

    //         }

    //     } catch (error) {
    //         Sys.Log.info('Error in PlayerLogin : ' + error);
    //         return {
    //             status: 'fail',
    //             result: null,
    //             message: 'Invalid credentials!',
    //             statusCode: 401
    //         }
    //     }

    // },

    // fbLogin: async function(socket, data) {

    //     try {
    //         var token = crypto.randomBytes(48)
    //             .toString('base64');

    //         if (!data.email) {
    //             return {
    //                 status: 'fails',
    //                 result: null,
    //                 message: 'Email id is require.'
    //             }
    //         }

    //         let players = await Sys.Game.Common.Services.PlayerServices.getOneByData({ email: data.email });
    //         if (players) {
    //             await Sys.Game.Common.Services.PlayerServices.update({
    //                 _id: players.id
    //             }, {
    //                 device: data.device,
    //                 firstname: data.firstname,
    //                 lastname: data.lastname,
    //                 fb_avatar: data.fb_avatar,
    //                 device_id: randomString(36),
    //                 username: data.firstname,
    //                 fcm_token: data.fcm_token,
    //                 device_name: data.device_name,
    //                 device_os: data.device_os,
    //                 accessToken: token,
    //                 provider: 'facebook'
    //             });

    //             players.level = checkLevel(players.xp);

    //             return {
    //                 status: 'success',
    //                 result: { players: players },
    //                 message: 'User login successfully.'

    //             }
    //             // saveFacebook(players.email);


    //         } else {
    //             players = await Sys.Game.Common.Services.PlayerServices.create({
    //                 device: data.device,
    //                 firstname: data.firstname,
    //                 lastname: data.lastname,
    //                 fb_avatar: data.fb_avatar,
    //                 device_id: randomString(36),
    //                 username: data.firstname,
    //                 fcm_token: data.fcm_token,
    //                 device_name: data.device_name,
    //                 device_os: data.device_os,
    //                 accessToken: token,
    //                 provider: 'facebook',
    //                 email: data.email,
    //                 isFbLogin: false,
    //                 chips: 0,
    //                 diamonds: 0,
    //                 cash: 0,
    //                 status: 'active',
    //             });

    //             players.level = checkLevel(players.xp);
    //             // updateUser(players);
    //             return {
    //                 status: 'success',
    //                 result: { players: players },
    //                 message: 'User login successfully.'

    //             }
    //         }

    //     } catch (error) {
    //         Sys.Log.info('Error in fblogin : ' + error);
    //     }
    // },

    // checkDailyBonus: async function(socket, data) {
    //     try {
    //         let ip = socket.handshake.address
    //         let player = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: data.id });
    //         if (!player) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Something is wrong. Find Player first'
    //             }
    //         }

    //         var date = moment().format('YYYY MM DD');
    //         // await checkForToday(player.id,async function (err, status) {
    //         let forToday = await Sys.Game.Common.Controllers.RoomProcess.checkForToday(ip);

    //         if (forToday instanceof Error) {
    //             return { status: 'fail', result: null, message: forToday.message, statusCode: 401 }
    //         }
    //         if (forToday) {
    //             player.dayPrize = null;
    //             // let plr = await creatLoginLog(player, date ,ip,data);
    //             let plr = await Sys.Game.Common.Controllers.RoomProcess.creatLoginLog(player, date, ip, data);
    //             if (plr instanceof Error) {
    //                 return { status: 'fail', result: null, message: plr.message, statusCode: 401 }
    //             }

    //             return {
    //                 status: 'success',
    //                 result: plr,
    //                 message: 'Player with daily bonus.'
    //             }
    //         } else {
    //             // let respon = await checkForYestarday(player.id,async function (err, status) {
    //             let forYestarday = await Sys.Game.Common.Controllers.RoomProcess.checkForYestarday(player.id);
    //             if (forYestarday instanceof Error) {
    //                 return { status: 'fail', result: null, message: forYestarday.message, statusCode: 401 }
    //             }

    //             var offers = await Sys.Game.Common.Services.LoginLogServices.getByDataBaseOffer({});
    //             if (!offers) {
    //                 return {
    //                     status: 'fail',
    //                     result: null,
    //                     message: 'Failed to login. Find Logs for day count'
    //                 }
    //             }

    //             if (forYestarday) {
    //                 if (player.day_count < offers.length) {
    //                     // console.log('Current is less')
    //                     player.day_count = parseInt(player.day_count) + 1;
    //                 }

    //                 player.chips = parseInt(player.chips) + parseInt(offers[player.day_count - 1].chips);
    //                 player.xp = parseInt(player.xp) + 50;

    //                 await Sys.Game.Common.Services.PlayerServices.update({
    //                     _id: player.id
    //                 }, {
    //                     chips: player.chips,
    //                     xp: player.xp
    //                 });

    //                 let transaction = await Sys.Game.Common.Services.ChipsTransactionService.create({
    //                     player: player.id,
    //                     gamePlayer: 0,
    //                     quantity: parseInt(offers[player.day_count - 1].chips),
    //                     remaining: parseInt(player.chips),
    //                     remark: 'Daily Bonus Added',
    //                     type: 'prizecredit'
    //                 });

    //                 if (!transaction) {
    //                     return {
    //                         status: 'fail',
    //                         result: null,
    //                         message: 'Failed to login. Can not add chip history'
    //                     }
    //                 }

    //                 player.dayPrize = offers[player.day_count - 1];
    //                 let plr = await Sys.Game.Common.Controllers.RoomProcess.creatLoginLog(player, date, ip, data);
    //                 if (plr instanceof Error) {
    //                     return { status: 'fail', result: null, message: plr.message, statusCode: 401 }
    //                 }
    //                 return {
    //                     status: 'success',
    //                     result: plr,
    //                     message: 'Player with daily bonus.'
    //                 }
    //             } else {
    //                 if (player.day_count != 1) {
    //                     player.day_count = 1;
    //                 }
    //                 player.chips = parseInt(player.chips) + parseInt(offers[player.day_count - 1].chips);
    //                 player.xp = parseInt(player.xp) + 50;

    //                 await Sys.Game.Common.Services.PlayerServices.update({
    //                     _id: player.id
    //                 }, {
    //                     chips: player.chips,
    //                     xp: player.xp
    //                 });

    //                 let transaction = await Sys.Game.Common.Services.ChipsTransactionService.create({
    //                     player: player.id,
    //                     gamePlayer: 0,
    //                     quantity: parseInt(offers[player.day_count - 1].chips),
    //                     remaining: parseInt(player.chips),
    //                     remark: 'Daily Bonus Added',
    //                     type: 'prizecredit'
    //                 });

    //                 if (!transaction) {
    //                     return {
    //                         status: 'fail',
    //                         result: null,
    //                         message: 'Failed to login. Can not add chip history'
    //                     }
    //                 }

    //                 player.dayPrize = offers[player.day_count - 1];
    //                 let plr = await Sys.Game.Common.Controllers.RoomProcess.creatLoginLog(player, date, ip, data);
    //                 if (plr instanceof Error) {
    //                     return { status: 'fail', result: null, message: plr.message, statusCode: 401 }
    //                 }
    //                 return {
    //                     status: 'success',
    //                     result: plr,
    //                     message: 'Player with daily bonus.'
    //                 }
    //             }
    //             // });
    //         }
    //         // });
    //     } catch (error) {
    //         Sys.Log.info('Error in checkDailyBonus : ' + error);
    //     }
    // },

    // profileGet: async function(socket, data) {
    //     try {
    //         if (!data.id) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Player id is require.'
    //             }
    //         }
    //         let player = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: data.id });
    //         if (!player) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Something is wrong.'
    //             }
    //         } else {

    //             if (player.statistics != null && player.statistics.hasOwnProperty('biggest_win')) {
    //                 player.biggest_win = player.statistics.biggest_win;
    //             } else {
    //                 player.biggest_win = 0;
    //             }

    //             player.level = checkLevel(player.xp);
    //             player.unreadMessages = 0;

    //             let friendTo = await Sys.Game.Common.Services.FriendService.getByData({ request_to: player.id, status: 'approved' });
    //             if (!friendTo) {
    //                 return {
    //                     status: 'fail',
    //                     result: null,
    //                     message: 'Validation error.'
    //                 }
    //             }

    //             let friendFrom = await Sys.Game.Common.Services.FriendService.getByData({ request_from: player.id, status: 'approved' });
    //             if (!friendFrom) {
    //                 return {
    //                     status: 'fail',
    //                     result: null,
    //                     message: 'Validation error.'
    //                 }
    //             }

    //             var result = [];
    //             var userIds = [];

    //             for (var i = 0; i < friendTo.length; i++) {
    //                 result.push(friendTo[i].request_from);
    //                 userIds.push(friendTo[i].request_from);
    //             }

    //             for (var i = 0; i < friendFrom.length; i++) {
    //                 result.push(friendFrom[i].request_to);
    //                 userIds.push(friendFrom[i].request_to);
    //             }

    //             let friend = await Sys.Game.Common.Services.FriendService.getFriendCount({ $and: [{ request_to: player.id }, { status: 'pending' }] });
    //             if (!friend) {
    //                 return {
    //                     status: 'fail',
    //                     result: null,
    //                     message: 'No result found.'
    //                 }
    //             }

    //             let messages = await Sys.Game.Common.Services.FriendService.getMessageCount({ $and: [{ reciever: player.id }, { sender: userIds, }, { isRead: false }] });
    //             if (!messages) {
    //                 return {
    //                     status: 'fail',
    //                     result: null,
    //                     message: 'No result found.'
    //                 }
    //             }

    //             player.unreadMessages = messages;
    //             player.friendRequest = friend;

    //             return {
    //                 unreadMessages: player.unreadMessages,
    //                 friendRequest: player.friendRequest,
    //                 status: 'success',
    //                 result: player,
    //                 message: 'Player profile detail.',
    //             }
    //         }

    //     } catch (error) {
    //         Sys.Log.info('Error in profileGet : ' + error);
    //     }
    // },

    // profileUpdate: async function(socket, data) {
    //     try {
    //         if (!data.id) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Player id is require.'
    //             }
    //         }
    //         if (data.chips) {
    //             delete data.chips;
    //         }
    //         if (data.level) {
    //             delete data.level;
    //         }
    //         let players = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: data.id });
    //         if (!players) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Player is not Found'
    //             }
    //         } else {
    //             await Sys.Game.Common.Services.PlayerServices.update({
    //                 _id: players.id
    //             }, data);
    //         }
    //         let plr = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: data.id });

    //         plr.level = checkLevel(plr.xp);

    //         return {
    //             status: 'success',
    //             level: plr.level,
    //             result: plr,
    //             message: 'Player updated successfully.'
    //         }

    //     } catch (error) {
    //         Sys.Log.info('Error in profileUpdate : ' + error);
    //     }
    // },

    // profileAvatarUpdate: async function(socket, data) {
    //     try {
    //         if (!data.id) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Player id is require.'
    //             }
    //         }
    //         let players = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: data.id });
    //         if (!players) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Player is not Found'
    //             }
    //         } else {
    //             await Sys.Game.Common.Services.PlayerServices.update({
    //                 _id: players.id
    //             }, {
    //                 avatar: data.avatar
    //             });
    //         }
    //         let plr = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: data.id });

    //         plr.level = checkLevel(plr.xp);

    //         return {
    //             status: 'success',
    //             level: plr.level,
    //             result: plr,
    //             message: 'Avatar updated successfully.'
    //         }

    //     } catch (error) {
    //         Sys.Log.info('Error in profileUpdate : ' + error);
    //     }
    // },

    // profileGuestUpdate: async function(socket, data) {
    //     try {
    //         console.log("get profileUpdate >>>>>>>", data)
    //         if (!data.id) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'User id is require.'
    //             }
    //         }
    //         let players = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: data.id });
    //         if (!players) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'User is not Found'
    //             }
    //         } else {
    //             await Sys.Game.Common.Services.PlayerServices.update({
    //                 _id: data.id
    //             }, data);
    //             let plr = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: data.id });

    //             console.log("get player data", plr)
    //             return {
    //                 status: 'success',
    //                 result: plr,
    //                 message: 'User updated successfully.'
    //             }
    //         }

    //     } catch (error) {
    //         Sys.Log.info('Error in profileGuestUpdate : ' + error);
    //     }
    // },

    // playerPicUpdate: async function(socket, data) {
    //     try {
    //         let player = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: data.playerId });

    //         if (player) {
    //             await Sys.Game.Common.Services.PlayerServices.update({
    //                 _id: data.playerId
    //             }, {
    //                 profilePic: data.profilePic,
    //             });
    //             return {
    //                 status: 'success',
    //                 message: "Profile Updated Successfully.",
    //                 statusCode: 200,
    //             }
    //         }
    //         return {
    //             status: 'fail',
    //             result: null,
    //             message: 'Player Not Found.',
    //             statusCode: 400
    //         }

    //     } catch (e) {
    //         Sys.Log.info('Error in playerPicUpdate : ' + e);
    //     }
    // },

    // getUserForWebgl: async function(socket, data) {
    //     try {
    //         console.log("getUserForWebgl data recieved", data);

    //         let playerD = await Sys.Game.Common.Services.PlayerServices.getWebglData({ global_ip: data.globalIp, userId: data.userId });
    //         console.log("getUserForWebgl playerD:::::", playerD)
    //         if (!playerD || playerD == null) {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Something Went Wrong',
    //                 statusCode: 400
    //             }
    //         }

    //         console.log("playerD", playerD);
    //         let player = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: data.userId });

    //         if (player) {
    //             console.log("=========================================================");
    //             console.log("themeId", playerD.themeId);
    //             console.log("=========================================================");
    //             console.log("getUserForWebgl socket.id recieved", socket.id);

    //             console.log("player.socket_id: ", player.socket_id)
    //             if (player.socket_id) {
    //                 console.log("Player Force Logout Send.");
    //                 await Sys.Io.to(player.socket_id).emit('forceLogOut', {
    //                     // await Sys.Io.to([player.socket_id]).emit('forceLogOut', {
    //                     playerId: player.id,
    //                     message: "You are logged off due to login from another device.",
    //                 });
    //             }

    //             let playerSocket = {
    //                 socket_id: socket.id
    //             }
    //             await player.updateOne(playerSocket)

    //             socket.mydata = {}
    //             socket.mydata.id = player.id

    //             let result = {
    //                 result: {
    //                     id: player.id,
    //                     username: player.username,
    //                     email: player.email,
    //                     chips: player.chips,
    //                     // cash : player.cash,
    //                     avatar: player.avatar
    //                 },
    //                 themeId: parseInt(playerD.themeId)
    //             }
    //             console.log("getUserForWebgl ::::: ---->>> result: ", result)
    //             return {
    //                 status: "success",
    //                 result: result,
    //                 message: "Player Data."
    //             }
    //         } else {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'Player Not Found.',
    //                 statusCode: 400
    //             }
    //         }

    //     } catch (e) {
    //         Sys.Log.info('Error in getUserForWebgl : ' + e);
    //     }
    // },

    // createGuest: async function(socket, data) {
    //     try {
    //         // Check Device Id  Already Available for Guest Login
    //         var passwordTrue = false
    //         let playerData
    //         let player = await Sys.Game.Common.Services.PlayerServices.getOneByData({ device_id: data.deviceId, isGuestPlayer: true });
    //         if (player) { // When Player Found
    //             let playerObj = {
    //                 device_id: data.deviceId,
    //                 device_os: data.os,
    //                 appVersion: data.appVersion,
    //                 isGuestPlayer: true
    //             };
    //             playerData = await Sys.Game.Common.Services.PlayerServices.getOneByData(playerObj);
    //             await Sys.Game.Common.Services.SocketServices.update({
    //                 playerId: playerData.id,
    //                 socketId: socket.id
    //             });
    //         } else {
    //             let playerObj = {
    //                 device_id: data.deviceId,
    //                 device_os: data.os,
    //                 appVersion: data.appVersion,
    //                 username: 'guest' + myFunction(),
    //                 isGuestPlayer: true
    //             };
    //             playerData = await Sys.Game.Common.Services.PlayerServices.create(playerObj);

    //             await Sys.Game.Common.Services.SocketServices.create({
    //                 playerId: playerData.id,
    //                 socketId: socket.id
    //             });

    //         }
    //         passwordTrue = true;
    //         if (passwordTrue) {
    //             let theme = await Sys.Game.Common.Services.PlayerServices.getThemeData({}, { _id: 1, theme_icon: 1, name: 1 })
    //             let themeData = []
    //             for (let i = 0; i < theme.length; i++) {
    //                 themeData.push({ id: theme[i]._id, name: theme[i].name, theme_icon: "/uploads/" + theme[i].theme_icon })
    //             }
    //             console.log(themeData);
    //             return {
    //                 status: 'success',
    //                 result: {
    //                     playerId: playerData.id,
    //                     username: playerData.username,
    //                     chips: playerData.chips,
    //                     cash: playerData.cash,
    //                     isGuestPlayer: playerData.isGuestPlayer,
    //                     avatar: playerData.avatar,
    //                     thumbnailList: themeData
    //                 },
    //                 message: 'Player Successfully Login!'
    //             }
    //             //}
    //         }

    //     } catch (error) {
    //         Sys.Log.info('Error in create guest Player : ' + error);
    //     }
    // },
    // forgetPassword: async function(socket, data, req) {
    //     var emailId = data.email;
    //     var os = data.os;
    //     // var deviceId = data.deviceId;
    //     var appVersion = data.appVersion
    //     try {
    //         if (emailId != "" && emailId != null) {
    //             var userDetail = await Sys.Game.Common.Services.PlayerServices.getOneByData({ 'email': emailId, "device_os": os, "appVersion": appVersion });
    //             if (userDetail) {

    //                 var uid = userDetail._id.toString();
    //                 var pswd = userDetail.password;
    //                 var dt = new Date();

    //                 var resetId = helper.enc(pswd, uid, dt);
    //                 var resetLink = Sys.Config.Database.baseUrl + '/casinoGame/reset?id=' + resetId;
    //                 var mailOptions = {
    //                     to_email: emailId,
    //                     subject: 'CASINO GAME : Forgot Password',
    //                     message: '<p>Hello ' + userDetail.username + ',<br><br>Click <a href="' + resetLink + '">here</a> to reset your password</p>'
    //                 };

    //                 await helper.sendMail(mailOptions);
    //                 return {
    //                     status: 'success',
    //                     message: 'Password Reset Link Send To Your Email Id'
    //                 }

    //             } else {
    //                 return {
    //                     status: 'fail',
    //                     result: null,
    //                     message: 'Email id not registered'
    //                 }
    //             }
    //         } else {
    //             return {
    //                 status: 'fail',
    //                 result: null,
    //                 message: 'please Enter email id'
    //             }
    //         }
    //     } catch (err) {
    //         console.log("forgot password:::::::::::>> err:", err);
    //     }
    // },
    // LogoutPlayer: async function(socket, data, req) {
    //     let playerId = data.playerId;
    //     console.log("playerId", playerId)
    //     let playerDetails = await Sys.Game.Common.Services.SocketServices.getByPlayerID({ playerId: playerId })
    //     if (playerDetails) {
    //         await Sys.Game.Common.Services.SocketServices.update({ playerId: playerDetails.playerId }, { socketId: "" })
    //         return {
    //             status: 'success',
    //             message: 'logout successfully'
    //         }
    //     } else {
    //         return {
    //             status: 'fail',
    //             message: 'error in logout'
    //         }
    //     }
    // },
    // SetPlayerAvatar: async function(socket, data) {
    //     let playerId = data.playerId;
    //     let avatarId = data.avatarId;
    //     console.log("playerId", playerId);
    //     console.log("avatarId", avatarId);

    //     let playerDetails = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: playerId })
    //     if (playerDetails) {
    //         await Sys.Game.Common.Services.PlayerServices.update({ _id: playerId }, { avatar: avatarId })
    //         return {
    //             status: 'success',
    //             message: 'avatar updated successfully'
    //         }
    //     } else {
    //         return {
    //             status: 'fail',
    //             message: 'user not found'
    //         }
    //     }
    // },
    // UpdatePlayerDetails: async function(socket, data) {
    //     let playerId = data.playerId
    //     let playerDetails = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: playerId })
    //     if (playerDetails) {
    //         let queryData = {
    //             $or: [
    //                 { username: data.username },
    //                 { email: data.email }
    //             ]
    //         }
    //         let playerQuery = await Sys.Game.Common.Services.PlayerServices.getOneByData(queryData)
    //         console.log("playerQuery", playerQuery);
    //         let playerEmail = await Sys.Game.Common.Services.PlayerServices.getOneByData({ email: data.email });
    //         let playerUsername = await Sys.Game.Common.Services.PlayerServices.getOneByData({ username: data.username });
    //         if (playerEmail) {
    //             if (playerEmail._id == data.playerId && playerEmail.email == data.email) {
    //                 await Sys.Game.Common.Services.PlayerServices.update({ _id: playerDetails._id }, { username: data.username })
    //             } else {
    //                 return {
    //                     status: 'fail',
    //                     result: null,
    //                     message: 'Email already taken.',
    //                     statusCode: 401
    //                 }
    //             }
    //         } else {
    //             if (playerUsername) {
    //                 if (playerUsername._id == data.playerId && playerUsername.username == data.username) {
    //                     await Sys.Game.Common.Services.PlayerServices.update({ _id: playerDetails._id }, { email: data.email })
    //                 } else {
    //                     return {
    //                         status: 'fail',
    //                         result: null,
    //                         message: 'UserName already taken.',
    //                         statusCode: 401
    //                     }
    //                 }
    //             }
    //         }

    //         await Sys.Game.Common.Services.PlayerServices.update({ _id: playerDetails._id }, { username: data.username, email: data.email })
    //         return {
    //             status: 'success',
    //             message: 'Player updated successfully'
    //         }
    //     }

    // },
    // DeleteAccount: async function(socket, data) {
    //     let playerId = data.playerId;
    //     let deviceId = data.deviceId;
    //     let playerDetails = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: playerId, device_id: deviceId })
    //     if (playerDetails) {
    //         await Sys.Game.Common.Services.PlayerServices.update({ _id: playerDetails.id, device_id: playerDetails.device_id }, { deleted: true })
    //         await Sys.Game.Common.Services.SocketServices.deleteSocketData({ playerId: playerDetails._id })
    //         return {
    //             status: 'success',
    //             message: 'Account Deleted successfully'
    //         }
    //     } else {
    //         return {
    //             status: 'fail',
    //             message: 'Account Not Found'
    //         }
    //     }
    // },
    // ChangePassword: async function(socket, data) {
    //     let playerId = data.playerId;
    //     let currentPassword = data.currentPassword;
    //     let newPassword = data.newPassword
    //     let soketData = await Sys.Game.Common.Services.SocketServices.getByPlayerID({ playerId: playerId })
    //     let playerDetails = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: playerId, deleted: false })
    //     if (soketData.socketId) {
    //         if (playerDetails) {
    //             if (bcrypt.compareSync(currentPassword, playerDetails.password)) {
    //                 await Sys.Game.Common.Services.PlayerServices.update({ _id: playerDetails.id }, { password: bcrypt.hashSync(newPassword, 10) })
    //                 return {
    //                     status: 'success',
    //                     message: 'Password Changed successfully'
    //                 }
    //             } else {
    //                 return {
    //                     status: 'fail',
    //                     message: 'Please Enter valid Current Password'
    //                 }
    //             }
    //         } else {
    //             return {
    //                 status: 'fail',
    //                 message: 'Account Not Found'
    //             }
    //         }
    //     } else {
    //         return {
    //             status: 'fail',
    //             message: 'Please Login For Change Password'
    //         }
    //     }
    // },
    // WithdrawMoney: async function(socket, data) {
    //     let playerId = data.playerId;
    //     let amount = data.amount;
    //     let deviceId = data.deviceId;
    //     let playerDetails = await Sys.Game.Common.Services.PlayerServices.getOneByData({ _id: playerId, deleted: false })
    //     if (playerDetails.chips >= amount) {
    //         let withdrawObj = {
    //             playerId: playerDetails._id,
    //             username: playerDetails.username,
    //             amount: amount,
    //         }
    //         await Sys.Game.Common.Services.WithdrawServices.createWithdraw({ withdrawObj })
    //         await Sys.Game.Common.Services.PlayerServices.update({ _id: playerDetails._id }, { chips: playerDetails.chips - amount })
    //         return {
    //             status: 'success',
    //             message: 'Your Withdraw request send successfully'
    //         }
    //     } else {
    //         return {
    //             status: 'fail',
    //             message: 'insufficient chips for withdraw'
    //         }
    //     }
    // },
    CMSPage: async function(socket, data) {

        // let playerId = data.playerId;
        let page = data.page;
        let query = {}
        if (page == "aboutUs") {
            query = { identifier: page }
        } else if (page == "privacyPolicy") {
            query = { identifier: page }
        } else if (page == "termsOfService") {
            query = { identifier: page }
        }
        let cmsData = await Sys.Game.Common.Services.CmsService.getCmsData(query);
        let string = cmsData[0].content.replace('\r\n', '<br>')
            // console.log("cmsData", cmsData);
        return {
            status: 'success',
            result: {
                description: string
            },

        }
        // if (page == "aboutUs") {
        //     return {
        //         status: 'success',
        //         result: {
        //             description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        //         },
        //         message: 'about us fetch successfully'
        //     }
        // } else if (page == "support") {
        //     return {
        //         status: 'success',
        //         result: {
        //             description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        //             contactNo: "+911234567890",
        //             email: "xyz@gmail.com",
        //         },
        //         message: 'support fetch successfully'
        //     }
        // } else if (page == "privacyPolicy") {
        //     return {
        //         status: 'success',
        //         result: {
        //             description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        //         },
        //         message: 'privacyPolicy fetch successfully'
        //     }
        // } else if (page == "termsOfService") {
        //     return {
        //         status: 'success',
        //         result: {
        //             description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        //         },
        //         message: 'termsOfService fetch successfully'
        //     }
        // } else {
        //     return {
        //         status: 'fail',
        //         result: null,
        //         message: 'Error in Page Fetch'
        //     }
        // }
    },

    SendMessageToSupport: async function(socket, data) {
        var firstName = data.firstName;
        var lastName = data.lastName;
        var email = data.email
        var phoneNumber = data.phoneNumber
        var message = data.message
        try {



            // var uid = userDetail._id.toString();
            // var pswd = userDetail.password;
            // var dt = new Date();

            // var resetId = helper.enc(pswd, uid, dt);
            // var resetLink = Sys.Config.Database.baseUrl + '/casinoGame/reset?id=' + resetId;
            var mailOptions = {
                to_email: "maulikmaniar2@gmail.com",
                subject: 'CASINO GAME : Support',
                message: '<p>Hello,<br><br>Support Details:<br>Name: ' + firstName + ' ' + lastName + '<br>Email Address: ' + email + '<br>Phone Number: ' + phoneNumber + '<br>Message : ' + message + '</p>',
                from: email
            };

            await helper.sendMail(mailOptions);
            await Sys.Game.Common.Services.CmsService.createSupport({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                message: data.message,
            })
            return {
                status: 'success',
                message: 'Your Details Send Successfully'
            }



        } catch (err) {
            console.log("forgot password:::::::::::>> err:", err);
        }

    },
    // Disconnect: async function(data) {
    //     let socketId = data
    //     let PlayerDetails = await Sys.Game.Common.Services.SocketServices.getByPlayerID({ socketId: socketId })
    //     if (PlayerDetails) {
    //         await Sys.Game.Common.Services.SocketServices.update({ _id: PlayerDetails._id }, { socketId: "" })
    //     }
    // }

}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function checkLevel(xp) {
    var level = {
        xp: xp,
        level: 0,
        max_xp: 0,
        min_xp: 0
    };
    let levelData = await Sys.Game.Common.Services.PlayerServices.getByLevel({});
    levelData.forEach(function(value) {
        if ((xp >= value.minimum && xp <= value.maximum) || (levelData[levelData.length - 1].level == value.level && xp > value.maximum)) {
            level.id = value.id;
            level.level = value.level;
            level.bonus = value.bonus;
            level.max_xp = value.maximum;
            level.min_xp = value.minimum;
        }
    })
    return level;

}

function myFunction() {
    var x = Math.floor((Math.random() * 100) + 1);
    return x;
}

function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}