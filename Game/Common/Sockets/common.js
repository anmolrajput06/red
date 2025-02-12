const { response } = require('express');
var Sys = require('../../../Boot/Sys');

module.exports = function(Socket) {

    // **********  BULLSHIT intigraction start *************
    
    Socket.on("register", async function(data,response) {
        response(await Sys.Game.Common.Controllers.PlayerController.register(data,Socket));
    });
    Socket.on("login", async function(data,response) {
        response(await Sys.Game.Common.Controllers.PlayerController.login(data,Socket));
    });
    Socket.on("logout", async function(data,response) {
        response(await Sys.Game.Common.Controllers.PlayerController.logout(data,Socket));
    });
    Socket.on("editProfile", async function(data,response) {
        response(await Sys.Game.Common.Controllers.PlayerController.editProfile(data,Socket));
    });
    Socket.on("addFavouriteGame", async function(data,response) {
        response(await Sys.Game.Common.Controllers.PlayerController.addFavouriteGame(data));
    });
    Socket.on("getBalance", async function(data,response) {
        response(await Sys.Game.Common.Controllers.PlayerController.getBalance(data));
    });
    Socket.on("updateBalance", async function(data,response) {
        response(await Sys.Game.Common.Controllers.PlayerController.updateBalance(data));
    });
    Socket.on("spin", async function(data,response) {
        console.log("spiining");
        
        response(await Sys.Game.Common.Controllers.GameController.spin(data,Socket));
    });
    
    // Socket.on('disconnect',async () => {
    //     Sys.Game.Common.Controllers.GameController.handleDisconnection(Socket);
    // });
    // **********  BULLSHIT intigraction End *************
}