var Sys = require('../../../Boot/Sys');

module.exports = function (Socket) {

	Socket.on("Login",async function(data,responce) {
	    responce(await Sys.Game.Slot.Controllers.ApiPlayerController.login(Socket,data)); 
	});

	Socket.on("GetUserLogin",async function(data,responce) {
	    responce(await Sys.Game.Slot.Controllers.AuthController.getUserLogin(Socket,data)); 
	});

	Socket.on("SymbolReelIndex",async function(data,responce) {
	    responce(await Sys.Game.Slot.Controllers.SymbolReelController.symbolReelIndex(Socket,data)); 
	});

	Socket.on("SymbolReelIndexSave",async function(data,responce) {
	    responce(await Sys.Game.Slot.Controllers.SymbolReelController.symbolReelIndexSave(Socket,data)); 
	});

	Socket.on("SymbolPayoutIndex",async function(data,responce) {
	    responce(await Sys.Game.Slot.Controllers.SymbolReelController.symbolPayoutIndex(Socket,data)); 
	});

	Socket.on("SymbolPayoutIndexSave",async function(data,responce) {
	    responce(await Sys.Game.Slot.Controllers.SymbolReelController.symbolPayoutIndexSave(Socket,data)); 
	});

	Socket.on("Register",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.register(Socket,data)); 
	});

	Socket.on("ProfileImageUpdate",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.profileImageUpdate(Socket,data)); 
	});

	Socket.on("ChangePassword",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.changePassword(Socket,data)); 
	});

	Socket.on("GetPlayersRank",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.getPlayersRank(Socket,data)); 
	});

	Socket.on("UpdateStatus",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.updateStatus(Socket,data)); 
	});

	Socket.on("UpdatePlayerStatus",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.updatePlayerStatus(Socket,data)); 
	});

	Socket.on("PurchaseChips",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.purchaseChips(Socket,data)); 
	});

	Socket.on("PurchaseTransactions",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.purchaseTransactions(Socket,data)); 
	});

	Socket.on("GetFaqs",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiOtherController.getFaqs(Socket,data)); 
	});

	Socket.on("GetPages",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiOtherController.getPages(Socket,data)); 
	});

	Socket.on("GetGameSpinReels",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiOtherController.getGameSpinReels(Socket,data)); 
	});

	Socket.on("GetAddAsFriend",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.getAddAsFriend(Socket,data)); 
	});

	Socket.on("GetRemoveAsFriend",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.getRemoveAsFriend(Socket,data)); 
	});

	Socket.on("GetFriendList",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.getFriendList(Socket,data)); 
	});

	Socket.on("GetFriendRequestList",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.getFriendRequestList(Socket,data)); 
	});

	Socket.on("GetFriendRequestAction",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.getFriendRequestAction(Socket,data)); 
	});

	Socket.on("GetFriendListOnline",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.getFriendListOnline(Socket,data)); 
	});

	Socket.on("GetFriendInvite",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.getFriendInvite(Socket,data)); 
	});

	Socket.on("GetBonusListByTime",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiOtherController.getBonusListByTime(Socket,data)); 
	});

	Socket.on("GetBonusListByDay",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiOtherController.getBonusListByDay(Socket,data)); 
	});

	Socket.on("GetBonusListByLevel",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiOtherController.getBonusListByLevel(Socket,data)); 
	});

	Socket.on("GetMyGiftList",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.getMyGiftList(Socket,data)); 
	});

	Socket.on("SetMyGiftList",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiPlayerController.setMyGiftList(Socket,data)); 
	});

	Socket.on("PostSupportCreate",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiOtherController.postSupportCreate(Socket,data)); 
	});

	Socket.on("GetSupport",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiOtherController.getSupport(Socket,data)); 
	});

	Socket.on("GetSupportDetail",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiOtherController.getSupportDetail(Socket,data)); 
	});

	Socket.on("PostSupportReply",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiOtherController.postSupportReply(Socket,data)); 
	});
	Socket.on("PlayerLeft",async function(data,responce) {
		responce(await Sys.Game.Slot.Controllers.ApiOtherController.playerLeft(Socket,data)); 
	});

}