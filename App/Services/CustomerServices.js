"use strict";

const mongoose = require("mongoose");
var Sys = require("../../Boot/Sys");
const { query } = require("express");
const customerModel = mongoose.model("customer");
const transactionModel = mongoose.model("transaction");
const cashHistoryModel = mongoose.model("cashHistory");
const cashierReportModel = mongoose.model("cashierReport");
const betReportModel = mongoose.model("betReport");
const userModel = mongoose.model("user");

module.exports = {
  createUser: async function (data) {
    console.log("createUser Data:", data);
    try {
      return await customerModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getcustomerDatatable: async function (query, start, length) {
    try {
      console.log("getcustomerDatatable", query, start, length);
      return await customerModel.find(query).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },

  getcustomer: async function (query) {
    try {
      return await customerModel.find(query);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getcustomerCount: async function (query) {
    try {
      return await customerModel.countDocuments(query);
    } catch (e) {
      console.log("Error", e);
    }
  },
  findOneUser: async function (query) {
    try {
      console.log("findOneUser", query);
      return await customerModel.findOne(query);
    } catch (e) {
      console.log("Error", e);
    }
  },
  updatecustomer: async function (condition, query) {
    try {
      return await customerModel.updateOne(condition, query);
    } catch (e) {
      console.log("Error", e);
    }
  },
  createTransaction: async function (data) {
    try {
      return await transactionModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  // findOnePurchase: async function(data){
  //     try{
  //         console.log("findOnePurchase data",data);
  //         return await transactionModel.findOne(data)
  //     }catch(e){
  //         console.log("Error", e);
  //     }
  // },
  createHistory: async function (data) {
    try {
      console.log("createHistory", data);
      return await cashHistoryModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  findOnePurchase: async function (data) {
    try {
      return await cashHistoryModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },


  getCashDatatable: async function (query, length, start) {
    try {
      console.log("getCashDatatable", query);
      return await cashHistoryModel
        .find(query)
        .skip(start)
        .limit(length)
        .lean();
    } catch (e) {
      console.log("Error", e);
    }
  },


  getCustomerlisting: async function (query, limit, page) {
    try {
      console.log("getCashDatatable", query);
      return await customerModel
        .find(query)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .sort({ "_id": -1 })
        .exec();
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCashCount: async function (data) {
    try {
      return await cashHistoryModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCashierReportDatatable: async function (query, length, start) {
    try {
      return await cashierReportModel
        .find(query)
        .skip(start)
        .limit(length)
        .lean();
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCashierReportCount: async function (data) {
    try {
      return await cashierReportModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCashierReportDetails: async function (data) {
    try {
      return await cashierReportModel.findOne(data).sort({ _id: 1 });
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCashierTotalReturn: async function (data) {
    try {
      console.log("data", data);
      return await cashierReportModel.aggregate([
        { $match: data },
        { $group: { _id: null, totalRedeem: { $sum: "$withdrwAmount" } } },
      ]);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCashierTotalCredit: async function (data) {
    try {
      console.log("data", data);
      return await cashierReportModel.aggregate([
        { $match: data },
        { $group: { _id: null, totalCredit: { $sum: "$depositAmount" } } },
      ]);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCustomerIdList: async function (data, projection) {
    try {
      console.log(data);
      return await customerModel.find(data, projection);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getBetReport: async function (data, length, start, date) {
    try {
      let query = [
        { $match: data },
        {
          $lookup: {
            from: "betReport",
            pipeline: [
              {
                $match: date,
              },
            ],
            localField: "_id",
            foreignField: "userIdObject.customerId",
            as: "betReport",
          },
        },

        {
          $project: {
            mainData: "$$ROOT", // Preserve the entire main document
            betReport: {
              // Handle joined data (optional, see below)
              $cond: {
                if: { $eq: [{ $size: "$betReport" }, 0] },
                then: [{}],
                else: "$betReport",
              },
            },
          },
        },
        { $unwind: "$betReport" },
        {
          $group: {
            _id: "$mainData._id",
            firstName: { $first: "$mainData.firstName" },
            lastName: { $first: "$mainData.lastName" },
            betReport: { $first: "$betReport" },
            spins: { $count: {} },
            bet: { $sum: "$betReport.pointsPlayed" },
            win: { $sum: { $toInt: "$betReport.lastWin" } },
          },
        },
        {
          $addFields: {
            name: {
              $concat: ["$firstName", " ", "$lastName"],
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $project: {
            _id: 1,
            spin: {
              $cond: { if: { $eq: ["$bet", 0] }, then: 0, else: "$spins" },
            },
            bet: 1,
            win: 1,
            name: 1,
          },
        },
        { $skip: start },
        { $limit: length },
      ];
      console.log(JSON.stringify(query));
      return await customerModel.aggregate(query);
      // return await betReportModel.find(data).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },
  getBetReportCount: async function (data) {
    try {
      return await customerModel.aggregate([
        { $match: data },
        {
          $lookup: {
            from: "betReport",
            localField: "_id",
            foreignField: "userIdObject.customerId",
            as: "betReport",
          },
        },
        {
          $project: {
            mainData: "$$ROOT", // Preserve the entire main document
            betReport: {

              $cond: {
                if: { $eq: [{ $size: "$betReport" }, 0] },
                then: [{}],
                else: "$betReport",
              },
            },
          },
        },
        { $unwind: "$betReport" },

        {
          $group: {
            _id: "$mainData._id",
          },
        },
        {
          $group: {
            _id: "",
            count: { $count: {} },
          },
        },
      ]);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getCashierBetReport: async function (data, length, start, date) {
    try {
      return await userModel.aggregate([
        {
          $match: data,
        },
        {
          $lookup: {
            from: "betReport",
            pipeline: [
              {
                $match: date,
              },
            ],
            localField: "_id",
            foreignField: "userIdObject.cashierId",
            as: "betReport",
          },
        },
        {
          $project: {
            mainData: "$$ROOT", // Preserve the entire main document
            betReport: {
              // Handle joined data (optional, see below)
              $cond: {
                if: { $eq: [{ $size: "$betReport" }, 0] },
                then: [{}],
                else: "$betReport",
              },
            },
          },
        },
        { $unwind: "$betReport" },
        {
          $group: {
            _id: "$mainData._id",
            name: { $first: "$mainData.name" },
            betReport: { $first: "$betReport" },
            spins: { $count: {} },
            bet: { $sum: "$betReport.pointsPlayed" },
            win: { $sum: { $toInt: "$betReport.lastWin" } },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $project: {
            _id: 1,
            spin: {
              $cond: { if: { $eq: ["$bet", 0] }, then: 0, else: "$spins" },
            },
            bet: 1,
            win: 1,
            name: 1,
          },
        },
        { $skip: start },
        { $limit: length },
      ]);
      // return await betReportModel.find(data).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },

  getCashierBetReportCount: async function (data) {
    try {
      return await userModel.aggregate([
        {
          $match: data,
        },
        {
          $lookup: {
            from: "betReport",
            localField: "_id",
            foreignField: "userIdObject.cashierId",
            as: "betReport",
          },
        },
        {
          $project: {
            mainData: "$$ROOT", // Preserve the entire main document
            betReport: {
              // Handle joined data (optional, see below)
              $cond: {
                if: { $eq: [{ $size: "$betReport" }, 0] },
                then: [{}],
                else: "$betReport",
              },
            },
          },
        },
        { $unwind: "$betReport" },
        {
          $group: {
            _id: "$mainData._id",
          },
        },
        {
          $group: {
            _id: "",
            count: { $count: {} },
          },
        },
      ]);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getShopBetReport: async function (data, length, start, date) {
    try {
      let query = [
        {
          $match: data,
        },
        {
          $lookup: {
            from: "betReport",
            pipeline: [
              {
                $match: date,
              },
            ],
            localField: "_id",
            foreignField: "userIdObject.shopId",
            as: "betReport",
          },
        },
        {
          $project: {
            mainData: "$$ROOT", // Preserve the entire main document
            betReport: {
              // Handle joined data (optional, see below)
              $cond: {
                if: { $eq: [{ $size: "$betReport" }, 0] },
                then: [{}],
                else: "$betReport",
              },
            },
          },
        },
        { $unwind: "$betReport" },
        {
          $group: {
            _id: "$mainData._id",
            name: { $first: "$mainData.name" },
            betReport: { $first: "$betReport" },
            spins: { $count: {} },
            bet: { $sum: "$betReport.pointsPlayed" },
            win: { $sum: { $toInt: "$betReport.lastWin" } },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $project: {
            _id: 1,
            spin: {
              $cond: { if: { $eq: ["$bet", 0] }, then: 0, else: "$spins" },
            },
            bet: 1,
            win: 1,
            name: 1,
          },
        },
        { $skip: start },
        { $limit: length },
      ];
      console.log(JSON.stringify(query));
      return await userModel.aggregate(query);
      // return await betReportModel.find(data).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },

  getShopBetReportCount: async function (data) {
    try {
      return await userModel.aggregate([
        {
          $match: data,
        },
        {
          $lookup: {
            from: "betReport",
            localField: "_id",
            foreignField: "userIdObject.shopId",
            as: "betReport",
          },
        },
        {
          $project: {
            mainData: "$$ROOT", // Preserve the entire main document
            betReport: {
              // Handle joined data (optional, see below)
              $cond: {
                if: { $eq: [{ $size: "$betReport" }, 0] },
                then: [{}],
                else: "$betReport",
              },
            },
          },
        },
        { $unwind: "$betReport" },
        {
          $group: {
            _id: "$mainData._id",
          },
        },
        {
          $group: {
            _id: "",
            count: { $count: {} },
          },
        },
      ]);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getSubDistributerBetReport: async function (data, length, start, date) {
    try {
      let query = [
        {
          $match: data,
        },
        {
          $lookup: {
            from: "betReport",
            pipeline: [
              {
                $match: date,
              },
            ],
            localField: "_id",
            foreignField: "userIdObject.subdistributorId",
            as: "betReport",
          },
        },
        {
          $project: {
            mainData: "$$ROOT", // Preserve the entire main document
            betReport: {
              // Handle joined data (optional, see below)
              $cond: {
                if: { $eq: [{ $size: "$betReport" }, 0] },
                then: [{}],
                else: "$betReport",
              },
            },
          },
        },
        { $unwind: "$betReport" },
        {
          $group: {
            _id: "$mainData._id",
            name: { $first: "$mainData.name" },
            betReport: { $first: "$betReport" },
            spins: { $count: {} },
            bet: { $sum: "$betReport.pointsPlayed" },
            win: { $sum: { $toInt: "$betReport.lastWin" } },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $project: {
            _id: 1,
            spin: {
              $cond: { if: { $eq: ["$bet", 0] }, then: 0, else: "$spins" },
            },
            bet: 1,
            win: 1,
            name: 1,
          },
        },
        { $skip: start },
        { $limit: length },
      ];
      console.log("Query==================>", JSON.stringify(query));
      return await userModel.aggregate(query);
      // return await betReportModel.find(data).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },

  getSubDistributerBetReportCount: async function (data) {
    try {
      return await userModel.aggregate([
        {
          $match: data,
        },
        {
          $lookup: {
            from: "betReport",
            localField: "_id",
            foreignField: "userIdObject.subdistributorId",
            as: "betReport",
          },
        },
        {
          $project: {
            mainData: "$$ROOT", // Preserve the entire main document
            betReport: {
              // Handle joined data (optional, see below)
              $cond: {
                if: { $eq: [{ $size: "$betReport" }, 0] },
                then: [{}],
                else: "$betReport",
              },
            },
          },
        },
        { $unwind: "$betReport" },
        {
          $group: {
            _id: "$mainData._id",
          },
        },
        {
          $group: {
            _id: "",
            count: { $count: {} },
          },
        },
      ]);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getDistributerBetReport: async function (data, length, start, date) {
    try {
      let query = [
        {
          $match: data,
        },
        {
          $lookup: {
            from: "betReport",
            pipeline: [
              {
                $match: date,
              },
            ],
            localField: "_id",
            foreignField: "userIdObject.distributorId",
            as: "betReport",
          },
        },
        {
          $project: {
            mainData: "$$ROOT", // Preserve the entire main document
            betReport: {
              // Handle joined data (optional, see below)
              $cond: {
                if: { $eq: [{ $size: "$betReport" }, 0] },
                then: [{}],
                else: "$betReport",
              },
            },
          },
        },
        { $unwind: "$betReport" },
        {
          $group: {
            _id: "$mainData._id",
            name: { $first: "$mainData.name" },
            betReport: { $first: "$betReport" },
            spins: { $count: {} },
            bet: { $sum: "$betReport.pointsPlayed" },
            win: { $sum: { $toInt: "$betReport.lastWin" } },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $project: {
            _id: 1,
            spin: {
              $cond: { if: { $eq: ["$bet", 0] }, then: 0, else: "$spins" },
            },
            bet: 1,
            win: 1,
            name: 1,
          },
        },
        { $skip: start },
        { $limit: length },
      ];
      console.log(JSON.stringify(query));
      return await userModel.aggregate(query);
      // return await betReportModel.find(data).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },

  getDistributerBetReportCount: async function (data) {
    try {
      return await userModel.aggregate([
        {
          $match: data,
        },
        {
          $lookup: {
            from: "betReport",
            localField: "_id",
            foreignField: "userIdObject.subdistributorId",
            as: "betReport",
          },
        },
        {
          $project: {
            mainData: "$$ROOT", // Preserve the entire main document
            betReport: {
              // Handle joined data (optional, see below)
              $cond: {
                if: { $eq: [{ $size: "$betReport" }, 0] },
                then: [{}],
                else: "$betReport",
              },
            },
          },
        },
        { $unwind: "$betReport" },
        {
          $group: {
            _id: "$mainData._id",
          },
        },
        {
          $group: {
            _id: "",
            count: { $count: {} },
          },
        },
      ]);
    } catch (e) {
      console.log("Error", e);
    }
  },

  //     getByData: async function(data) {
  //         console.log('Find By Data:', data);
  //         try {
  //             return await userModel.find(data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     getUserCount: async function(data) {
  //         try {
  //             return await userModel.countDocuments(data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     getOneByData: async function(data) {
  //         console.log('Find By Data:', data);
  //         try {
  //             return await userModel.findOne(data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     createCommission:async function(data){
  //         try {
  //             return await commissionHistoryModel.create(data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     // getFindOneByData: async function(data) {
  //     //     console.log('Find By Data:', data);
  //     //     try {
  //     //         return await userModel.findOneAndUpdate(data);
  //     //     } catch (e) {
  //     //         console.log("Error", e);
  //     //     }
  //     // },
  //     getUserData: async function(data) {
  //         try {
  //             return await userModel.find(data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },

  //     getSingleUserData: async function(data) {
  //         try {
  //             return await userModel.findOne(data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  // updateCommisionRange: async function(condition,data){
  //     try{
  //         return await commissionRangeModel.updateOne(condition,data)
  //     }
  //     catch(e){
  //         console.log("Error",e);
  //     }
  // },
  // findCommissionRange: async function(data){
  //     try{
  //         return await commissionRangeModel.findOne(data)
  //     }
  //     catch(e){
  //         console.log("Error",e);
  //     }
  // },
  // createCommisionRange:async function(data){
  //     try{
  //         return await commissionRangeModel.create(data)
  //     }
  //     catch(e){
  //         console.log("Error",e);
  //     }
  // },

  // getCommissionRange: async function(data){
  // try{
  //     return await commissionRangeModel.findOne(data)
  // }
  // catch(e){
  //     console.log("Error",e);
  // }
  // },
  //     getUserDatatable: async function(query, length, start) {
  //         try {
  //             console.log("calll", query);
  //             return await userModel.find(query).skip(start).limit(length);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     getUserLookup: async function(query) {
  //         try {
  //             console.log("calll", query);
  //             return await userModel.aggregate(query)
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     insertUserData: async function(data) {
  //         try {
  //             await userModel.create(data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },

  //     deleteUser: async function(data) {
  //         try {
  //             await userModel.deleteOne({ _id: data });
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     deleteRole: async function(data) {
  //         try {
  //             console.log("data",data);
  //            return await roleModel.deleteOne({ name: data });
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },

  //     updateUserData: async function(condition, data) {
  //         try {
  //             console.log(condition,data);
  //             let data1 =  await userModel.updateOne(condition, data);
  //             console.log(data1);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },

  //     getfindOneAndUpdate: async function(condition, data) {
  //         try {
  //             await userModel.findOneAndUpdate(condition, data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },

  //     createWebglData: async function(data) {
  //         try {
  //             await webGlRequest.create(data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     roleAdd: async function(data) {
  //         try {
  //             return await roleModel.create(data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     roleUpdate: async function(condition, data) {
  //         try {
  //             return await roleModel.updateOne(condition, data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     getRole: async function(data) {
  //         try {
  //             console.log(data);
  //             return await roleModel.findOne(data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     getAllRole: async function(data) {
  //         try {
  //             console.log(data);
  //             return await roleModel.find(data);
  //         } catch (e) {
  //             console.log("Error", e);
  //         }
  //     },
  //     getUserCount: async function(data){
  //         try{
  //             return await userModel.countDocuments(data);
  //         } catch(e){
  //             console.log("Error", e);
  //         }
  //     }
};
