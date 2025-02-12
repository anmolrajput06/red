var Sys = require("../../Boot/Sys");
var bcrypt = require("bcryptjs");
var helper = require("../../Helper/helper");
var dateformat = require("dateformat");
const mongoose = require("mongoose");
module.exports = {
  cashierManagement: async function (req, res) {
    try {
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        cashierMangement: "active",
        role: req.session.details.role,
      };
      return res.render("cashier/cashier", data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCashier: async function (req, res) {
    try {
      console.log("req.body", req.query);
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {
        role: "cashier",
        userId: mongoose.Types.ObjectId(req.session.details.id),
      };

      if (search != "") {
        query.userName = { $regex: ".*" + search + ".*" };
      }
      if (req.query.startdate != "" && req.query.enddate != "") {
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
      let data = await Sys.App.Services.UserServices.getCashierDatatable(
        query,
        length,
        start
      );
      let dataCount = await Sys.App.Services.UserServices.getUserCount(query);
      console.log("data", data);

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
  getShops: async function (req, res) {
    try {
      console.log("req.body", req.query);
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = { role: "shop", userId: req.session.details.id };

      if (search != "") {
        query.userName = { $regex: ".*" + search + ".*" };
      }
      if (req.query.startdate != "" && req.query.enddate != "") {
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
  addShops: async function (req, res) {
    try {
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        shopMangement: "active",
        role: req.session.details.role,
      };
      return res.render("shop/addShop", data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  addCashier: async function (req, res) {
    try {
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        cashierMangement: "active",
        role: req.session.details.role,
      };
      return res.render("cashier/addCashier", data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  addPostCashier: async function (req, res) {
    try {
      let shop = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.session.details.id,
      });
      let userIdObject = shop.userIdObject;
      userIdObject.shopId = mongoose.Types.ObjectId(req.session.details.id);
      let user = await Sys.App.Services.UserServices.createUser({
        uniqueId: Math.random().toString().substr(2, 6),
        name: req.body.name,
        userName: req.body.username,
        userIdObject: userIdObject,
        email: req.body.email,
        mobile: req.body.number,
        password: bcrypt.hashSync(req.body.password, 10),
        role: "cashier",
        timeZone: req.body.timeZone,
        userId: shop._id,
        bonceBackLimit: req.body.bonceBackLimit,
        bounceBack: shop.bounceBack,
        rtpSettings: shop.rtpSettings,
        cashOut: shop.cashOut,
        gameMode: shop.gameMode,
        comunityPrice: shop.comunityPrice,
        city: req.body.city,
      });
      if (user) {
        var mailOptions = {
          to_email: req.body.email,
          subject: "Planet Sweep Slot : Your Account Credentials",
          message:
            "<p>Dear " +
            req.body.name +
            ",<br><br>We hope this email finds you well. As requested, here are your account credentials for Planet Sweep Slot.<br><br>Username: " +
            req.body.username +
            " / " +
            req.body.email +
            "<br>Password: " +
            req.body.password +
            "<br><br>For security reasons, we recommend changing your password immediately upon logging in. If you have any difficulties or concerns, please do not hesitate to contact our support team at [support@gmail.com].<br><br>Thank you for choosing Planet Sweep Slot.<br><br>Best regards,<br>Planet Sweep Slot.</p>",
        };
        await helper.sendMail(mailOptions);
        await Sys.App.Services.UserServices.updateUserData(
          { _id: req.session.details.id },
          { $inc: { createdUser: 1 } }
        );
        req.flash("success", "Your cashier created successfully.");
        return res.redirect("/cashier");
      } else {
        req.flash("success", "Something went wrong!");
        return res.redirect("/cashier");
      }
    } catch (e) {
      console.log("Error", e);
    }
  },
  editCashier: async function (req, res) {
    try {
      let cashier = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.params.id,
      });
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        cashierMangement: "active",
        role: req.session.details.role,
        cashier: cashier,
      };
      return res.render("cashier/addCashier", data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  editPostCashier: async function (req, res) {
    try {
      let cashier = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.params.id,
      });
      if (cashier) {
        let password;
        if (isBcryptHash(req.body.password)) {
          password = req.body.password;
        } else {
          password = bcrypt.hashSync(req.body.password, 10);
        }
        await Sys.App.Services.UserServices.updateUserData(
          { _id: req.params.id },
          {
            name: req.body.name,
            userName: req.body.username,
            email: req.body.email,
            password: password,
            mobile: req.body.number,
            timeZone: req.body.timeZone,
            city: req.body.city,
          }
        );
        req.flash("success", "Your user updated successfully.");
        return res.redirect("/cashier");
      } else {
        req.flash("error", "Somthing went error!");
        return res.redirect("/cashier");
      }
    } catch (e) {
      console.log("Error", e);
    }
  },
  editShops: async function (req, res) {
    try {
      let shop = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.params.id,
      });
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        shopMangement: "active",
        role: req.session.details.role,
        shop: shop,
      };
      return res.render("shop/addShop", data);
    } catch (e) {
      console.log("error", e);
    }
  },
  editPostShops: async function (req, res) {
    try {
      let shop = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.params.id,
      });
      if (shop) {
        let password;
        if (isBcryptHash(req.body.password)) {
          password = req.body.password;
        } else {
          password = bcrypt.hashSync(req.body.password, 10);
        }
        await Sys.App.Services.UserServices.updateUserData(
          { _id: req.params.id },
          {
            name: req.body.name,
            userName: req.body.username,
            email: req.body.email,
            password: password,
            mobile: req.body.number,
            timeZone: req.body.timeZone,
            city: req.body.city,
          }
        );
        req.flash("success", "Your user updated successfully.");
        return res.redirect("/shop");
      } else {
        req.flash("error", "Your shop not registred yet.");
        return res.redirect("/shop");
      }
    } catch (e) {
      console.log("error", e);
    }
  },

  gameSetting: async function (req, res) {
    try {
      let shop = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.params.id,
      });
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        distributorsMangement: "active",
        role: req.session.details.role,
        shop: shop,
      };
      return res.render("shop/gameSetting", data);
    } catch (e) {}
  },

  betReport: async function (req, res) {
    try {
      let id =
        req.params.id != undefined && req.params.id != ""
          ? req.params.id
          : null;
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        shopBetReport: "active",
        report: "active",
        role: req.session.details.role,
        id: id,
      };
      return res.render("report/cashierBetReports", data);
    } catch (e) {
      console.log("error", e);
    }
  },

  getBetReportData: async function (req, res) {
    try {
      console.log(
        "id=====================================>",
        req.session.details.id
      );

      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search;
      let query = {};
      let date = {};
      if (
        req.query.id != null &&
        req.query.id != undefined &&
        req.query.id != ""
      ) {
        let id = req.query.id;
        query = {
          "userIdObject.shopId": { $eq: mongoose.Types.ObjectId(id) },
          role: "cashier",
        };
      } else {
        query = {
          "userIdObject.shopId": {
            $eq: mongoose.Types.ObjectId(req.session.details.id),
          },
          role: "cashier",
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
        date.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      console.log("query=========>", query);

      let data = await Sys.App.Services.CustomerServices.getCashierBetReport(
        query,
        length,
        start,
        date
      );
      console.log("data=>>>>>", data);
      let dataCount =
        await Sys.App.Services.CustomerServices.getCashierBetReportCount(query);
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
  cashierProfile: async function (req, res) {
    let userData = await Sys.App.Services.UserServices.getUserData({
      _id: req.params.id,
    });
    let gameList = await Sys.App.Services.GameService.findGame({});
    console.log(userData[0]);
    data = {
      App: Sys.Config.App.details,
      error: req.flash("error"),
      success: req.flash("success"),
      // shopBetReport: "active",
      // report: "active",
      role: req.session.details.role,
      userData: userData[0],
      gameList: gameList,
    };
    res.render("distributor/cashierProfile", data);
  },
  customerList: async function (req, res) {
    try {
      let id=req.params.id;
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        cashierMangement: "active",
        role: req.session.details.role,
        id:id
      };
      return res.render("shop/customer", data);
    } catch (e) {
      console.log("error", e);
    }
  },
  getCustomerList: async function (req, res) {
    try {
      console.log("req.body", req.query);
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;
      let query = { userId: req.query.id };
      if (search != "") {
        query.userName = { $regex: ".*" + search + ".*" };
      }
      if (req.query.startdate != "" && req.query.enddate != "") {
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
      let data = await Sys.App.Services.UserServices.getCustomerDatatable(
        query,
        length,
        start
      );
      let dataCount = await Sys.App.Services.UserServices.getCustomerCount(query);
      console.log("data===============================================>", data);

      var obj = {
        draw: req.query.draw,
        recordsTotal: dataCount,
        recordsFiltered: dataCount,
        data: data,
      };
      res.send(obj);
    } catch (e) {
      console.log("error", e);
    }
  },
};
function isBcryptHash(value) {
  // Regular expression to match bcrypt hashes
  const bcryptHashRegex = /^\$2[aby]\$.{56}$/;
  return bcryptHashRegex.test(value);
}
