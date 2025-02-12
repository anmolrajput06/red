var Sys = require("../../Boot/Sys");
var moment = require("moment");
const mongoose = require("mongoose");

module.exports = {
  home: async function (req, res) {
    try {
      console.log("req.session.role", req.session.details.role);
      
      let resultData={};
      let dashboardData = {};
      let todayDashboardData = {};
      let weekleyDashboardData = {};
      let monthleyDashboardData = {};
      let today = moment().toISOString();
      today=new Date(today);
      today.setHours(0, 0, 0, 0);
      let todayEnd = moment().subtract(0, 'days').toISOString();
      todayEnd=new Date(todayEnd);
      todayEnd.setHours(23, 59, 59, 999);
      let lastWeek = moment().subtract(7, 'days').toISOString();
      lastWeek=new Date(lastWeek);
      lastWeek.setHours(23, 59, 59, 999);
      let lastMonth = moment().subtract(30, 'days').toISOString();
      lastMonth=new Date(lastMonth);
      lastMonth.setHours(23, 59, 59, 999);

      console.log("today",today,"todayEnd",todayEnd,"lastWeek",lastWeek,"lastMonth",lastMonth);

      if(req.session.details.role=="admin"){
        dashboardData.totalDistributors=await Sys.App.Services.UserServices.getDistributorCount({'role':'distributor'});
      dashboardData.totalSubDistributors=await Sys.App.Services.UserServices.getSubDistributorCount({'role':'subDistributor'});
      dashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'role':'shop'});
      dashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'role':'cashier'});
      dashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({});
      dashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({});

      todayDashboardData.totalDistributors=await Sys.App.Services.UserServices.getDistributorCount({'role':'distributor' ,'createdAt' : { $gte: today, $lte: todayEnd }});
      todayDashboardData.totalSubDistributors=await Sys.App.Services.UserServices.getSubDistributorCount({'role':'subDistributor' ,'createdAt' : { $gte: today, $lte: todayEnd }});
      todayDashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'role':'shop' ,'createdAt' : { $gte: today, $lte: today }});
      todayDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'role':'cashier' ,'createdAt' : { $gte: today, $lte: todayEnd }});
      todayDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({'createdAt' : { $gte: today, $lte: todayEnd }});
      todayDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({'createdAt' : { $gte: today, $lte: todayEnd }});

      weekleyDashboardData.totalDistributors=await Sys.App.Services.UserServices.getDistributorCount({'role':'distributor' ,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
      weekleyDashboardData.totalSubDistributors=await Sys.App.Services.UserServices.getSubDistributorCount({'role':'subDistributor' ,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
      weekleyDashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'role':'shop' ,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
      weekleyDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'role':'cashier' ,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
      weekleyDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
      weekleyDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({'createdAt' : { $gte: lastWeek, $lte: todayEnd }});

      monthleyDashboardData.totalDistributors=await Sys.App.Services.UserServices.getDistributorCount({'role':'distributor','createdAt' : { $gte: lastMonth, $lte: todayEnd }});
      monthleyDashboardData.totalSubDistributors=await Sys.App.Services.UserServices.getSubDistributorCount({'role':'subDistributor' ,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
      monthleyDashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'role':'shop' ,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
      monthleyDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'role':'cashier' ,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
      monthleyDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({ 'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
      monthleyDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({ 'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
      }else  if(req.session.details.role=="distributor"){
   
      dashboardData.totalSubDistributors=await Sys.App.Services.UserServices.getSubDistributorCount({'userId':req.session.details.id,'role':'subDistributor'});
      dashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'userId':req.session.details.id,'role':'shop'});
      dashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier'});
      dashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({'userId':req.session.details.id,});
      dashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({'userIdObject.distributorId':mongoose.Types.ObjectId(req.session.details.id)});

      todayDashboardData.totalSubDistributors=await Sys.App.Services.UserServices.getSubDistributorCount({'userId':req.session.details.id,'role':'subDistributor' ,'createdAt' : { $gte: today, $lte: todayEnd }});
      todayDashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'userId':req.session.details.id,'role':'shop' ,'createdAt' : { $gte: today, $lte: todayEnd }});
      todayDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier' ,'createdAt' : { $gte: today, $lte: todayEnd }});
      todayDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({'userId':req.session.details.id,'createdAt' : { $gte: today, $lte: todayEnd }});
      todayDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({'userIdObject.distributorId':mongoose.Types.ObjectId(req.session.details.id),'createdAt' : { $gte: today, $lte: todayEnd }});

      weekleyDashboardData.totalSubDistributors=await Sys.App.Services.UserServices.getSubDistributorCount({'userId':req.session.details.id,'role':'subDistributor' ,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
      weekleyDashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'userId':req.session.details.id,'role':'shop' ,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
      weekleyDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier' ,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
      weekleyDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({'userId':req.session.details.id,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
      weekleyDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({'userIdObject.distributorId':mongoose.Types.ObjectId(req.session.details.id),'createdAt' : { $gte: lastWeek, $lte: todayEnd }});

      monthleyDashboardData.totalSubDistributors=await Sys.App.Services.UserServices.getSubDistributorCount({'userId':req.session.details.id,'role':'subDistributor' ,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
      monthleyDashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'userId':req.session.details.id,'role':'shop' ,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
      monthleyDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier' ,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
      monthleyDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({ 'userId':req.session.details.id,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
      monthleyDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({ 'userIdObject.distributorId':mongoose.Types.ObjectId(req.session.details.id),'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
      }
      else  if(req.session.details.role=="subDistributor"){
        
        dashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'userId':req.session.details.id,'role':'shop'});
        dashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier'});
        dashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({'userId':req.session.details.id,});
        dashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({'userIdObject.subdistributorId':mongoose.Types.ObjectId(req.session.details.id)});
  
        todayDashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'userId':req.session.details.id,'role':'shop' ,'createdAt' : { $gte: today, $lte: todayEnd }});
        todayDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier' ,'createdAt' : { $gte: today, $lte: todayEnd }});
        todayDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({'userId':req.session.details.id,'createdAt' : { $gte: today, $lte: todayEnd }});
        todayDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({'userIdObject.subdistributorId':mongoose.Types.ObjectId(req.session.details.id),'createdAt' : { $gte: today, $lte: todayEnd }});
  
        weekleyDashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'userId':req.session.details.id,'role':'shop' ,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
        weekleyDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier' ,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
        weekleyDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({'userId':req.session.details.id,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
        weekleyDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({'userIdObject.subdistributorId':mongoose.Types.ObjectId(req.session.details.id),'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
  
        monthleyDashboardData.totalShops=await Sys.App.Services.UserServices.getShopCount({'userId':req.session.details.id,'role':'shop' ,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
        monthleyDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier' ,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
        monthleyDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({ 'userId':req.session.details.id,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
        monthleyDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({ 'userIdObject.subdistributorId':mongoose.Types.ObjectId(req.session.details.id),'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
        }
        else  if(req.session.details.role=="shop"){
        
          dashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier'});
          dashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({'userId':req.session.details.id,});
          dashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({'userIdObject.shopId':mongoose.Types.ObjectId(req.session.details.id)});
    
          todayDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier' ,'createdAt' : { $gte: today, $lte: todayEnd }});
          todayDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({'userId':req.session.details.id,'createdAt' : { $gte: today, $lte: todayEnd }});
          todayDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({'userIdObject.shopId':mongoose.Types.ObjectId(req.session.details.id),'createdAt' : { $gte: today, $lte: todayEnd }});
    
          weekleyDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier' ,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
          weekleyDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({'userId':req.session.details.id,'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
          weekleyDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({'userIdObject.shopId':mongoose.Types.ObjectId(req.session.details.id),'createdAt' : { $gte: lastWeek, $lte: todayEnd }});
    
          monthleyDashboardData.totalCashiers=await Sys.App.Services.UserServices.getCashierCount({'userId':req.session.details.id,'role':'cashier' ,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
          monthleyDashboardData.totalCustomers=await Sys.App.Services.UserServices.getCustomerCount({ 'userId':req.session.details.id,'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
          monthleyDashboardData.totalProfit=await Sys.App.Services.UserServices.getProfit({ 'userIdObject.shopId':mongoose.Types.ObjectId(req.session.details.id),'createdAt' : { $gte: lastMonth, $lte: todayEnd }});
          }
      
      resultData={
        "dashboardData":dashboardData,
        "todayDashboardData":todayDashboardData,
        "weekleyDashboardData":weekleyDashboardData,
        "monthleyDashboardData":monthleyDashboardData,
      }
      console.log("resultData==>",resultData);

      var data = {
        App: Sys.Config.App.details,
        role: req.session.details.role,
        classActive: "active",
        resultData:resultData
      };
      return res.render("client/dashboard", data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  dashboard: async function (req, res) {
    try {
      let admin = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.session.details.id,
      });
      console.log("admin========================================>",admin);
      let getTotalGamePlayed = 0;
      let getTotalPlayer = 0;
      let getTotalActivePlayer = 0;
      let getTotalInactivePlayer = 0;
      let getTotalGuestPlayer = 0;
      let getTopPlayers = null;
      if (admin != null) {
        getTotalPlayer = await Sys.App.Services.PlayerServices.getPlayerCount({
          isGuestPlayer: false,
          deleted: false,
        });
        getTotalActivePlayer =
          await Sys.App.Services.PlayerServices.getPlayerCount({
            status: { $in: ["active", "playing", "lobby"] },
            isGuestPlayer: false,
            deleted: false,
          });
        getTotalInactivePlayer =
          await Sys.App.Services.PlayerServices.getPlayerCount({
            status: "inactive",
            isGuestPlayer: false,
            deleted: false,
          });
        getTotalGuestPlayer =
          await Sys.App.Services.PlayerServices.getPlayerCount({
            isGuestPlayer: true,
          });
        // Total game Played
        let playerTotalGame = await Sys.App.Services.GameService.getGameCount([
          {
            $match: {
              type: "bet",
            },
          },
          {
            $count: "type",
          },
        ]);
        if (playerTotalGame.length > 0) {
          getTotalGamePlayed = playerTotalGame[0].type;
        }
      } else {
        getTotalPlayer = await Sys.App.Services.PlayerServices.getPlayerCount({
          isGuestPlayer: false,
          deleted: false,
        });
        getTotalActivePlayer =
          await Sys.App.Services.PlayerServices.getPlayerCount({
            status: { $in: ["active", "playing", "lobby"] },
            isGuestPlayer: false,
            deleted: false,
          });
        getTotalInactivePlayer =
          await Sys.App.Services.PlayerServices.getPlayerCount({
            status: "inactive",
            isGuestPlayer: false,
            deleted: false,
          });
        getTotalGuestPlayer =
          await Sys.App.Services.PlayerServices.getPlayerCount({
            isGuestPlayer: true,
          });
        let playerId = await Sys.App.Services.PlayerServices.getPlayerData(
          { isGuestPlayer: false, deleted: false },
          { _id: 1 }
        );
        if (playerId.length > 0) {
          let ids = [];
          for (let i = 0; i < playerId.length; i++) {
            ids.push(playerId[i]._id);
          }
          console.log("playerId", ids);
          ids = ids.map(function (el) {
            return mongoose.Types.ObjectId(el);
          });
          console.log("ids", ids);
          let playerTotalGame = await Sys.App.Services.GameService.getGameCount(
            [
              {
                $match: {
                  player: { $in: ids },
                  type: "bet",
                  isGuestPlayer: false,
                },
              },
              {
                $count: "type",
              },
            ]
          );
          console.log("playerTotalGame", playerTotalGame);
          if (playerTotalGame.length > 0) {
            getTotalGamePlayed = playerTotalGame[0].type;
          }
        }
      }
      let latestPalyer = await Sys.App.Services.PlayerServices.getLimitPlayer({
        status: { $in: ["active", "playing", "lobby"] },
        isGuestPlayer: false,
      });
      console.log("latestPalyer", latestPalyer);
      // convert timestamp to date time format
      for (var m = 0; m < latestPalyer.length; m++) {
        let dt = new Date(latestPalyer[m].createdAt);
        latestPalyer[m].createdAtFormated = moment(dt).format("YYYY/MM/DD");
      }
      let guestPalyer = await Sys.App.Services.PlayerServices.getLimitPlayer({
        isGuestPlayer: true,
      });
      console.log("latestPalyer", guestPalyer);
      // convert timestamp to date time format
      for (var m = 0; m < guestPalyer.length; m++) {
        let dt = new Date(guestPalyer[m].createdAt);
        guestPalyer[m].createdAtFormated = moment(dt).format("YYYY/MM/DD");
      }

      getTopPlayers =
        await Sys.App.Services.PlayerServices.getLimitedPlayerWithSort(
          {
            status: { $in: ["active", "playing", "lobby"] },
            isGuestPlayer: false,
          },
          10,
          "chips",
          -1
        );
      let columns = ["totalIncome", "jackpotPlanIncome"];
      let settings =
        await Sys.App.Services.SettingsServices.getPayoutFindByData(
          {},
          columns
        );
      console.log("settings", settings);
      console.log("getTotalGamePlayed", getTotalGamePlayed);
      var data = {
        App: Sys.Config.App.details,
        role: req.session.details.role,
        classActive: "active",
        totalPlayer: getTotalPlayer,
        latestPalyer: latestPalyer,
        guestPalyer: guestPalyer,
        totalGamePlayed: getTotalGamePlayed,
        topPlayers: getTopPlayers,
        // chipsIncome: settings[0].totalIncome,
        // jackpotAmount: settings[0].jackpotPlanIncome,
        totalActivePlayer: getTotalActivePlayer,
        totalInactivePlayer: getTotalInactivePlayer,
        totalGuestPlayer: getTotalGuestPlayer,
        error: req.flash("error"),
        success: req.flash("success"),
        roleData: roleApprove,
      };
      return res.render("client/dashboard", data);
    } catch (e) {
      console.log("Error", e);
    }
  },
};
