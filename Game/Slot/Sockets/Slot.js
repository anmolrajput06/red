var Sys = require('../../../Boot/Sys');

module.exports = function (Socket) {

  // **********  Dubai slot intigraction start *************

  Socket.on("GetGames",async function(data,responce) {
    console.log("GetGames Event Call: ");
    responce(await Sys.Game.Slot.Controllers.PlayerController.getGames(Socket,data)); 
  });
  Socket.on("GetJoinGame",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getJoinGame(Socket,data)); 
  });
  Socket.on("GetLines",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getLines(Socket,data)); 
  });
  Socket.on("GetSymbols",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getSymbols(Socket,data)); 
  });
  Socket.on("GetGamesHistory",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getGamesHistory(Socket,data)); 
  });
  Socket.on("GetGamesHistoryDetail",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getGamesHistoryDetail(Socket,data)); 
  });
  Socket.on("GetRoomUsers",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getRoomUsers(Socket,data)); 
  });
  Socket.on("getRoomUsersDetail",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getRoomUsersDetail(Socket,data)); 
  });
  Socket.on("GetJoinGameByRoom",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getJoinGameByRoom(Socket,data)); 
  });
  Socket.on("GetBets",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getBets(Socket,data)); 
  });
  Socket.on("GetAddBonasToPlayerBydeviceAndTimeId",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getAddBonasToPlayerBydeviceAndTimeId(Socket,data)); 
  });
  Socket.on("GetAddBonasToPlayerBydeviceAndLevelId",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getAddBonasToPlayerBydeviceAndLevelId(Socket,data)); 
  });
  Socket.on("Jackpot",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.jackpot(Socket,data)); 
  });
  Socket.on("SpinReels",async function(data,responce) {
    // responce(await Sys.Game.Slot.Controllers.PlayerController.newSpinReels(Socket,data)); 
    // responce(await Sys.Game.Slot.Controllers.PlayerController.demoSpinReels(Socket,data)); 
    console.log("SpinReels",data)
    responce(await Sys.Game.Slot.Controllers.PlayerController.recSpinReels(Socket,data));
  });
  Socket.on("GetPayoutDetail",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getPayoutDetail(Socket,data)); 
  });
  Socket.on("PostLocalEvent",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.postLocalEvent(Socket,data)); 
  });
  Socket.on("GetGiftList",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getGiftList(Socket,data)); 
  });
  Socket.on("GetGiftSendReceive",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.getGiftSendReceive(Socket,data)); 
  });
  Socket.on("ResizeImage",async function(data,responce) {
    responce(await Sys.Game.Slot.Controllers.PlayerController.resizeImage(Socket,data)); 
  });
  Socket.on("GetTheme",async function(data,responce) {
    console.log("GetTheme Event Call: ");
      responce(await Sys.Game.Slot.Controllers.PlayerController.getTheme(Socket,data)); 
  });
  Socket.on("TestData",async function(data,responce) {
    console.log("TestData");
    responce(await Sys.Game.Slot.Controllers.PlayerController.checkNewLogic(Socket,data)); 
  });
  Socket.on("TestNewPayoutLogic",async function(data,responce) {
    console.log("TestNewPayoutLogic");
    responce(await Sys.Game.Slot.Controllers.PlayerController.demoSpinReels(Socket,data));
  });
  Socket.on("TestRecPayoutLogic",async function(data,responce) {
    console.log("TestRecPayoutLogic");
    responce(await Sys.Game.Slot.Controllers.PlayerController.recSpinReels(Socket, data));
  });

}