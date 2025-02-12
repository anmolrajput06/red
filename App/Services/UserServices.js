"use strict";

const mongoose = require("mongoose");
var Sys = require("../../Boot/Sys");
const userModel = mongoose.model("user");
const customerModel = mongoose.model("customer");
const webGlRequest = mongoose.model("webGlRequest");
const roleModel = mongoose.model("roleManagement");
const commissionRangeModel = mongoose.model("commissionRange");
const commissionHistoryModel = mongoose.model("commissionHistory");
const settingModel = mongoose.model("setting");
const cashierReportsModel = mongoose.model("cashierReport");
const betReportModel = mongoose.model("betReport");

module.exports = {
  createUser: async function (data) {
    console.log("createUser Data:", data);
    try {
      return await userModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  createSetting: async function (data) {
    try {
      return await settingModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getSettings: async function (data) {
    try {
      return await settingModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  updateSetting: async function (query, condition) {
    try {
      return await settingModel.updateOne(query, condition);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getByData: async function (data) {
    console.log("Find By Data:", data);
    try {
      return await userModel.find(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getUserCount: async function (data) {
    try {
      return await userModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCustomerCount: async function (data) {
    try {
      return await customerModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getOneByData: async function (data) {
    console.log("Find By Data:", data);
    try {
      return await userModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  createCommission: async function (data) {
    try {
      return await commissionHistoryModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  // getFindOneByData: async function(data) {
  //     console.log('Find By Data:', data);
  //     try {
  //         return await userModel.findOneAndUpdate(data);
  //     } catch (e) {
  //         console.log("Error", e);
  //     }
  // },
  getUserData: async function (data) {
    try {
      return await userModel.find(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getSingleUserData: async function (data) {
    try {
      return await userModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getSingleCustomerData: async function (data) {
    try {
      return await customerModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  updateCommisionRange: async function (condition, data) {
    try {
      return await commissionRangeModel.updateOne(condition, data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  findCommissionRange: async function (data) {
    try {
      return await commissionRangeModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  createCommisionRange: async function (data) {
    try {
      return await commissionRangeModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getCommissionRange: async function (data) {
    try {
      return await commissionRangeModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getUserDatatable: async function (query, length, start) {
    try {
      console.log("calll", query);
      return await userModel.find(query).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCashierDatatable: async function (data, length, start) {
    try {
      console.log("calll", data);
      let query=[
        {
          $match: data,
        },
        {
            $lookup: {
              from: "customer",
              localField: "_id",
              foreignField: "userId",
              as: "metaUserList",
            },
           
        },
        {
            $addFields:{
              createdUser:{ $size: "$metaUserList" }
            }
        },
        { $skip: start },
        { $limit: length },
      ]
      console.log(JSON.stringify(query));
      return await userModel.aggregate(query);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCustomerDatatable: async function (query, length, start) {
    try {
      console.log("calll", query);
      return await customerModel.find(query).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },
  getUserLookup: async function (query) {
    try {
      console.log("calll", query);
      return await userModel.aggregate(query);
    } catch (e) {
      console.log("Error", e);
    }
  },
  insertUserData: async function (data) {
    try {
      await userModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  deleteUser: async function (data) {
    try {
      await userModel.deleteOne({ _id: data });
    } catch (e) {
      console.log("Error", e);
    }
  },
  deleteRole: async function (data) {
    try {
      console.log("data", data);
      return await roleModel.deleteOne({ name: data });
    } catch (e) {
      console.log("Error", e);
    }
  },

  updateUserData: async function (condition, data) {
    try {
      console.log(condition, data);
      let data1 = await userModel.updateOne(condition, data);
      console.log(data1);
    } catch (e) {
      console.log("Error", e);
    }
  },
  updateCustomerData: async function (condition, data) {
    try {
      console.log(condition, data);
      let data1 = await customerModel.updateOne(condition, data);
      console.log(data1);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getfindOneAndUpdate: async function (condition, data) {
    try {
      await userModel.findOneAndUpdate(condition, data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  createWebglData: async function (data) {
    try {
      await webGlRequest.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  roleAdd: async function (data) {
    try {
      return await roleModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  roleUpdate: async function (condition, data) {
    try {
      return await roleModel.updateOne(condition, data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getRole: async function (data) {
    try {
      console.log(data);
      return await roleModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getAllRole: async function (data) {
    try {
      console.log(data);
      return await roleModel.find(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getUserCount: async function (data) {
    try {
      return await userModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  createBalanceReport: async function (data) {
    try {
      return await cashierReportsModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  findCashierData: async function (data) {
    try {
      return await cashierReportsModel.find(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  updateCashierReportData: async function (condition, data) {
    try {
      return await cashierReportsModel.updateOne(condition, data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  findTotalAmount: async function (data) {
    try {
      console.log("data", data);
      return await cashierReportsModel.aggregate([
        { $match: { user: mongoose.Types.ObjectId(data) } },
        {
          $group: {
            _id: null,
            totalDeposit: { $sum: "$depositAmount" },
            totalRedeem: { $sum: "$withdrwAmount" },
          },
        },
      ]);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getDistributorCount:async function(data){
    try {
      return await userModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getSubDistributorCount:async function(data){
    try {
      return await userModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getShopCount:async function(data){
    try {
      return await userModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCashierCount:async function(data){
    try {
      return await userModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCustomerCount:async function(data){
    try {
      return await customerModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getProfit:async function(data){
    console.log("data==>",data);
    try {
      return await betReportModel.aggregate([
        {
          $match:data
        },
        {
          $group:{
            _id:"",
            count:{
              $count:{}
            },
            totalBet:{
              $sum:"$pointsPlayed"
            },
            totalWin:{
              $sum:{$toInt:"$lastWin"}
            }
          }
        },
        {
          $project:{
            count:1,
            totalBet:1,
            totalWin:1,
            totalProfit:{$subtract:["$totalBet","$totalWin"]}
          }
        }
      ]);
    } catch (e) {
      console.log("Error", e);
    }
  },
};
