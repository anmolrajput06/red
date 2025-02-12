var Sys = require("../../Boot/Sys");
var bcrypt = require("bcryptjs");
var helper = require("../../Helper/helper");
var moment = require("moment");
var dateformat = require("dateformat");
const mongoose = require("mongoose");
module.exports = {
  userManagement: async function (req, res) {
    try {
      let userDetails = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.session.details.id,
      });
      console.log(userDetails);
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        userManagement: "active",
        role: req.session.details.role,
      };
      return res.render("user/user", data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getUser: async function (req, res) {
    try {
      console.log("req.body", req.query, typeof req.session.details.id);
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {
        role: { $in: ["subDistributor", "shop"] },
        userId: mongoose.Types.ObjectId(req.session.details.id),
      };

      if (search != "") {
        query.userName = { $regex: ".*" + search + ".*" };
      }

      if (req.query.startdate != "" && req.query.enddate != "") {
        // Convert start and end dates to UTC midnight and end of the day
        // console.log("Start_date1==>", req.query.startdate);
        // let startdate = moment(req.query.startdate).format('YYYY-MM-DD');
        // console.log("Start_date2==>", startdate);
        // startdate= new Date(startdate);
        // console.log("Start_date3==>", startdate);
        // startdate.setHours(0, 0, 0, 0);
        const startdate = req.query.startdate;
        const [day1, month1, year1] = startdate.split("/");
        const startDate = new Date(year1, month1 - 1, day1);
        startDate.setHours(0, 0, 0, 0);
        let enddate = req.query.enddate;
        const [day, month, year] = enddate.split("/");
        const endDate = new Date(year, month - 1, day);
        endDate.setHours(23, 59, 59, 999);
        console.log("startDate, endDate", startDate, endDate);

        // Use $expr, $gte, and $lte to query the date range
        query.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      console.log("getDistributors query", query);
      let data = await Sys.App.Services.UserServices.getUserDatatable(
        query,
        length,
        start
      );
      let dataCount = await Sys.App.Services.UserServices.getUserCount(query);
      console.log("dataCount", dataCount);

      var obj = {
        draw: req.query.draw,
        recordsTotal: dataCount,
        recordsFiltered: dataCount,
        data: data,
      };
      res.send(obj);
    } catch (e) {
      console.log("Error", e);
    }
  },
  addUser: async function (req, res) {
    try {
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        userManagement: "active",
        role: req.session.details.role,
      };
      return res.render("user/addUser", data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  addPostUser: async function (req, res) {
    try {
      console.log("req.body", req.body);
      let bounceData = [];
      let distributor = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.session.details.id,
      });
      if (req.body.mode == "sweepStakes" && req.body.bounceBack == "true") {
        bounceData = [
          {
            minDeposit: 0,
            maxDeposit: 19.99,
            bounceBackUsd: req.body.bounce1,
          },
          {
            minDeposit: 20,
            maxDeposit: 49.99,
            bounceBackUsd: req.body.bounce2,
          },
          {
            minDeposit: 50,
            maxDeposit: 99.99,
            bounceBackUsd: req.body.bounce3,
          },
          {
            minDeposit: 100,
            bounceBackUsd: req.body.bounce4,
          },
        ];
      }
      let userIdObject = {};
      userIdObject.distributorId = mongoose.Types.ObjectId(
        req.session.details.id
      );
      let user = await Sys.App.Services.UserServices.createUser({
        uniqueId: Math.random().toString().substr(2, 6),
        userId: req.session.details.id,
        userIdObject: userIdObject,
        name: req.body.name,
        userName: req.body.username,
        email: req.body.email,
        mobile: req.body.number,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.userType,
        bonceBackLimit: req.body.bonceBackLimit,
        bounceBack: bounceData,
        rtpSettings: distributor.rtpSettings,
        timeZone: req.body.timeZone,
        cashOut: req.body.cashOut,
        gameMode: req.body.mode,
        comunityPrice: req.body.comunityPrice,
        city: req.body.city,
        percentage: req.body.percentage,
      });
      if (user) {
        await Sys.App.Services.UserServices.updateUserData(
          { _id: req.session.details.id },
          { $inc: { createdUser: 1 } }
        );
        req.flash("success", "Your user created successfully.");
        return res.redirect("/user");
      } else {
      }
    } catch (e) {
      console.log("Error", e);
    }
  },
  editUser: async function (req, res) {
    try {
      let user = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.params.id,
      });
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        userManagement: "active",
        role: req.session.details.role,
        user: user,
      };
      console.log("Sub distributer data =>>", data);
      return res.render("user/addUser", data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  editPostUser: async function (req, res) {
    try {
      let user = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.params.id,
      });
      if (user) {
        let bounceData = [];
        let gameData = [];
        let password;
        for (let i = 0; i < 5; i++) {
          gameData.push({
            game: req.body["game" + [i]],
          });
        }
        console.log("gameData", gameData);
        if (isBcryptHash(req.body.password)) {
          password = req.body.password;
        } else {
          password = bcrypt.hashSync(req.body.password, 10);
        }
        if (req.body.mode == "sweepStakes" && req.body.bounceBack == "true") {
          bounceData = [
            {
              minDeposit: 0,
              maxDeposit: 19.99,
              bounceBackUsd: req.body.bounce1,
            },
            {
              minDeposit: 20,
              maxDeposit: 49.99,
              bounceBackUsd: req.body.bounce2,
            },
            {
              minDeposit: 50,
              maxDeposit: 99.99,
              bounceBackUsd: req.body.bounce3,
            },
            {
              minDeposit: 100,
              bounceBackUsd: req.body.bounce4,
            },
          ];
        }
        console.log("bounceData", bounceData, gameData);
        await Sys.App.Services.UserServices.updateUserData(
          { _id: req.params.id },
          {
            name: req.body.name,
            userName: req.body.username,
            email: req.body.email,
            password: password,
            mobile: req.body.number,
            bonceBackLimit: req.body.bonceBackLimit,
            bounceBack: bounceData,
            timeZone: req.body.timeZone,
            cashOut: req.body.cashOut,
            gameMode: req.body.mode,
            comunityPrice: req.body.comunityPrice,
            city: req.body.city,
            percentage: req.body.percentage,
          }
        );
        req.flash("success", "Your user updated successfully.");
        let user_id = await Sys.App.Services.UserServices.getSingleUserData({
          _id: req.params.id,
        });
        if (req.session.details.role == "admin") {
          return res.redirect("/viewSubDistributor/" + user_id.userId);
        } else if (req.session.details.role == "subDistributor") {
          return res.redirect("/subDistributor/shops/" + user_id.userId);
        } else {
          return res.redirect("/user");
        }
      } else {
      }
    } catch (e) {
      console.log("Error", e);
    }
  },
  editPostUsers: async function (req, res) {
    try {
      let user = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.params.id,
      });
      if (user) {
        let bounceData = [];
        let gameData = [];
        let password;
        for (let i = 0; i < 5; i++) {
          gameData.push({
            game: req.body["game" + [i]],
          });
        }
        console.log("gameData", gameData);
        if (isBcryptHash(req.body.password)) {
          password = req.body.password;
        } else {
          password = bcrypt.hashSync(req.body.password, 10);
        }
        if (req.body.mode == "sweepStakes" && req.body.bounceBack == "true") {
          bounceData = [
            {
              minDeposit: 0,
              maxDeposit: 19.99,
              bounceBackUsd: req.body.bounce1,
            },
            {
              minDeposit: 20,
              maxDeposit: 49.99,
              bounceBackUsd: req.body.bounce2,
            },
            {
              minDeposit: 50,
              maxDeposit: 99.99,
              bounceBackUsd: req.body.bounce3,
            },
            {
              minDeposit: 100,
              bounceBackUsd: req.body.bounce4,
            },
          ];
        }
        console.log("bounceData", bounceData, gameData);
        await Sys.App.Services.UserServices.updateUserData(
          { _id: req.params.id },
          {
            name: req.body.name,
            userName: req.body.username,
            email: req.body.email,
            password: password,
            mobile: req.body.number,
            bonceBackLimit: req.body.bonceBackLimit,
            bounceBack: bounceData,
            timeZone: req.body.timeZone,
            cashOut: req.body.cashOut,
            gameMode: req.body.mode,
            comunityPrice: req.body.comunityPrice,
            city: req.body.city,
            percentage: req.body.percentage,
          }
        );
        req.flash("success", "Your user updated successfully.");
        let user_id = await Sys.App.Services.UserServices.getSingleUserData({
          _id: req.params.id,
        });
        if (req.session.details.role == "admin") {
          return res.redirect("/subDistributors/shops/" + user_id.userId);
        } else {
          return res.redirect("/subDistributor/shops/" + user_id.userId);
        }
      } else {
      }
    } catch (e) {
      console.log("Error", e);
    }
  },
  addDistributor: async function (req, res) {
    try {
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        distributorsMangement: "active",
        role: req.session.details.role,
      };
      return res.render("distributor/addDistributor", data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  addPostDistributor: async function (req, res) {
    try {
      console.log("req.body", req.body);
      let bounceData = [];
      let gameData = [];
      for (let i = 0; i < 5; i++) {
        gameData.push({
          game: req.body["game" + [i]],
        });
      }
      console.log("gameData", gameData);
      if (req.body.mode == "sweepStakes" && req.body.bounceBack == "true") {
        bounceData = [
          {
            minDeposit: 0,
            maxDeposit: 19.99,
            bounceBackUsd: req.body.bounce1,
          },
          {
            minDeposit: 20,
            maxDeposit: 49.99,
            bounceBackUsd: req.body.bounce2,
          },
          {
            minDeposit: 50,
            maxDeposit: 99.99,
            bounceBackUsd: req.body.bounce3,
          },
          {
            minDeposit: 100,
            bounceBackUsd: req.body.bounce4,
          },
        ];
      }
      await Sys.App.Services.UserServices.createUser({
        uniqueId: Math.random().toString().substr(2, 6),
        name: req.body.name,
        userName: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        mobile: req.body.number,
        role: "distributor",
        bonceBackLimit: req.body.bonceBackLimit,
        bounceBack: bounceData,
        rtpSettings: gameData,
        userId: req.session.details.id,
        timeZone: req.body.timeZone,
        cashOut: req.body.cashOut,
        gameMode: req.body.mode,
        comunityPrice: req.body.comunityPrice,
        city: req.body.city,
        percentage: req.body.percentage,
      });
      req.flash("success", "Your user created successfully.");
      return res.redirect("/distributors");
    } catch (e) {
      console.log("Error", e);
    }
  },
  changeDistributorStatus: async function (req, res) {
    try {
      console.log("req.body", req.body);
      let distributor = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.body.id,
      });
      let status;
      if (distributor) {
        if (distributor.status == "active") {
          status = "inactive";
        } else {
          status = "active";
        }
        await Sys.App.Services.UserServices.updateUserData(
          { _id: req.body.id },
          { status: status }
        );
        return res.send("success");
      }
    } catch (e) {
      console.log("Error", e);
    }
  },
  editDistributor: async function (req, res) {
    try {
      console.log("req.param.id", req.params);
      let distributor = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.params.id,
      });
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        distributorsMangement: "active",
        role: req.session.details.role,
        distributor: distributor,
      };
      console.log("distributor", distributor);
      return res.render("distributor/addDistributor", data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  editPostDistributor: async function (req, res) {
    try {
      console.log("req.body", req.body);
      let bounceData = [];
      let gameData = [];
      let password;
      for (let i = 0; i < 5; i++) {
        gameData.push({
          game: req.body["game" + [i]],
        });
      }
      console.log("gameData", gameData);
      if (isBcryptHash(req.body.password)) {
        password = req.body.password;
      } else {
        password = bcrypt.hashSync(req.body.password, 10);
      }
      if (req.body.mode == "sweepStakes" && req.body.bounceBack == "true") {
        bounceData = [
          {
            minDeposit: 0,
            maxDeposit: 19.99,
            bounceBackUsd: req.body.bounce1,
          },
          {
            minDeposit: 20,
            maxDeposit: 49.99,
            bounceBackUsd: req.body.bounce2,
          },
          {
            minDeposit: 50,
            maxDeposit: 99.99,
            bounceBackUsd: req.body.bounce3,
          },
          {
            minDeposit: 100,
            bounceBackUsd: req.body.bounce4,
          },
        ];
      }
      console.log("bounceData", bounceData, gameData);
      await Sys.App.Services.UserServices.updateUserData(
        { _id: req.params.id },
        {
          name: req.body.name,
          userName: req.body.username,
          email: req.body.email,
          password: password,
          mobile: req.body.number,
          bonceBackLimit: req.body.bonceBackLimit,
          bounceBack: bounceData,
          rtpSettings: gameData,
          timeZone: req.body.timeZone,
          cashOut: req.body.cashOut,
          gameMode: req.body.mode,
          comunityPrice: req.body.comunityPrice,
          city: req.body.city,
        }
      );
      req.flash("success", "Your user updated successfully.");
      return res.redirect("/distributors");
    } catch (e) {
      console.log("Error", e);
    }
  },

  validateEmail: async function (req, res) {
    try {
      console.log("validateEmail", req.body.email);
      let distributor = await Sys.App.Services.UserServices.getSingleUserData({
        email: req.body.email,
      });
      if (req.body.distributorId != "" && distributor) {
        if (distributor._id == req.body.distributorId) {
          return res.send("error");
        } else {
          return res.send("success");
        }
      } else {
        if (distributor) {
          return res.send("success");
        } else {
          return res.send("error");
        }
      }
    } catch (e) {
      console.log("distributorController validateEmail Error", e);
      return new Error("distributorController validateEmail Error", e);
    }
  },

  validateUserName: async function (req, res) {
    try {
      console.log("validateUsername data", req.body);
      let distributor = await Sys.App.Services.UserServices.getSingleUserData({
        firstName: req.body.username,
      });
      if (req.body.distributorId != "" && distributor) {
        if (distributor._id == req.body.distributorId) {
          return res.send("error");
        } else {
          return res.send("success");
        }
      } else {
        if (distributor) {
          return res.send("success");
        } else {
          return res.send("error");
        }
      }
    } catch (e) {
      console.log("distributorController validateUsername Error", e);
      return new Error("distributorController validateUsername Error", e);
    }
  },
  gameSetting: async function (req, res) {
    try {
      let distributor = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.params.id,
      });
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        distributorsMangement: "active",
        role: req.session.details.role,
        distributor: distributor,
      };
      console.log("distributor", distributor);
      return res.render("user/gameSetting", data);
    } catch (e) {}
  },

  betReport: async function (req, res) {
    try {
      
      let id=(req.params.id!=undefined  && req.params.id!="")?req.params.id:null;
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        shopBetReport: "active",
        report: "active",
        role: req.session.details.role,
        id:id
      };
      return res.render("report/subDistributerBetReports", data);
    } catch (e) {
      console.log("error", e);
    }
  },

  getBetReportData: async function (req, res) {
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search;
      let query ={};
      let date={};
            if(req.query.id!=null && req.query.id!=undefined && req.query.id!=""){
                let id=req.query.id;
                query = {
                  "userIdObject.distributorId": {
                    $eq: mongoose.Types.ObjectId(id),
                  },
                  $or:[{role: "subDistributor"},{role: "shop"}]
                  
                };
            }else{
              query = {
                "userIdObject.distributorId": {
                  $eq: mongoose.Types.ObjectId(req.session.details.id),
                },
                $or:[{role: "subDistributor"},{role: "shop"}]
              };
            }

      if (search.value != undefined && search.value != "") {
        query.name = {
          $regex: search.value,
        };
      }
      if (req.query.startdate != "" && req.query.enddate != "") {
        // Convert start and end dates to UTC midnight and end of the day
        let startdate = req.query.startdate;
        const [startDay, startMonth, startYear] = startdate.split("/");
        const startDate = new Date(startYear, startMonth - 1, startDay);
        startDate.setHours(0, 0, 0, 0);
        let enddate = req.query.enddate;
        const [day, month, year] = enddate.split("/");
        const endDate = new Date(year, month - 1, day);
        endDate.setHours(23, 59, 59, 999);
        console.log("startDate, endDate", startDate, endDate);
        // Use $expr, $gte, and $lte to query the date range
        date.createdAt={ 
          $gte: startDate,
          $lte: endDate,
        };
      }
      console.log("Subdistributer========================>");
      let data =
        await Sys.App.Services.CustomerServices.getSubDistributerBetReport(
          query,
          length,
          start,
          date
        );
      console.log("data=>>>>>", data);
      let dataCount =
        await Sys.App.Services.CustomerServices.getSubDistributerBetReportCount(
          query
        );
      var obj = {
        draw: req.query.draw,
        recordsTotal: dataCount[0] == undefined ? 0 : dataCount[0].count,
        recordsFiltered: dataCount[0] == undefined ? 0 : dataCount[0].count,
        data: data,
      };
      console.log("obj===>", obj);
      res.send(obj);
    } catch (e) {
      console.log("getSelfReportData error", e);
    }
  },

  subDistributorProfile:async function(req,res){
    let userData = await Sys.App.Services.UserServices.getUserData({"_id":req.params.id});
    let gameList = await Sys.App.Services.GameService.findGame({});
    console.log(userData[0]);
    data={
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        // shopBetReport: "active",
        // report: "active",
        role: req.session.details.role,
        userData:userData[0],
        gameList:gameList
    }
    res.render("distributor/subDistributorProfile",data)
  }
};


function isBcryptHash(value) {
  // Regular expression to match bcrypt hashes
  const bcryptHashRegex = /^\$2[aby]\$.{56}$/;

  return bcryptHashRegex.test(value);
}
