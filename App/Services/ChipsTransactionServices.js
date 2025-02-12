'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const chipsTransactionModel = mongoose.model('chipsTransaction');
// const chipsHistoryModel = mongoose.model('chipsHistory')
const commissionHistoryReport = mongoose.model('commissionHistory')
const selfReport = mongoose.model('selfReport')


module.exports = {

    getByChipsTransaction: async function(data) {
        try {
            return await chipsTransactionModel.find(data).populate('player', { firstname: 1, _id: 1 }).populate('gamePlayer', { game: 1 });
        } catch (error) {
            console.log("Chips Transaction Service error getByChipsTransaction", error);
        }
    },
    selfReportFind:async function(data,skip,length){
      try {
        return await selfReport.find(data).skip(skip).limit(length);
    } catch (err) {
        console.log("Self Report Service error -> ", err);
    }
    },
    selfReportFindCount:async function(data){
      try {
        return await selfReport.countDocuments(data);
    } catch (err) {
        console.log("Self Report Service error -> ", err);
    }
    },
    create: async function(data) {
        try {
            return await chipsTransactionModel.create(data);
        } catch (err) {
            console.log("Chips Transaction Service error create -> ", err);
        }
    },
    getChipsTarsactionHistory: async function (data, length, start) {
      try {
        return await chipsHistoryModel.find(data).skip(start).limit(length);
      } catch (error) {
        console.log("Chips Transaction Service error getByChipsTransaction", error);
      }
    },
    getCommissionHistory: async function (data) {
      try {
        return await commissionHistoryReport.aggregate(data);
      } catch (error) {
        console.log("Chips Transaction Service error getByChipsTransaction", error);
      }
    },
    getCommissionHistoryCount: async function(data){ 
    try {
      return await commissionHistoryReport.aggregate(data);
    } catch (error) {
      console.log("Chips Transaction Service error getByChipsTransaction", error);
    }
  },
    getChipsTarsactionHistoryCount: async function(data){
      try {
        return await chipsHistoryModel.countDocuments(data);
      } catch (error) {
        console.log("Chips Transaction Service error getByChipsTransaction", error);
      }
    },
    
    getByChipsTransactionDataCount: query =>
        chipsTransactionModel.distinct("spin", query),

    getByChipsTransactionData: async(query, skip, limit) => {
        try {
            return await chipsTransactionModel
                .aggregate([{
                        $match: query
                    },
                    /* {
                      $group: {
                        _id: {
                          spin: "$spin",
                          type: "$type"
                        },
                        chips: {
                          $sum: "$quantity"
                        },
                        player: {
                          $first: "$player"
                        },
                        id: {
                          $first: "$_id"
                        },
                        remainingChips: {
                          $push: "$remaining"
                        },
                        gameId: {
                          $first: "$gamePlayer"
                        },
                        date: {
                          $first: "$createdAt"
                        }
                      }
                    }, */
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $lookup: {
                            from: "player",
                            localField: "player",
                            foreignField: "_id",
                            as: "playerDetail"
                        }
                    },
                    /* {
                      $unwind: {
                        path: "$playerDetail",
                        preserveNullAndEmptyArrays: true
                      }
                    }, */
                    {
                        $lookup: {
                            from: "gamePlayer",
                            localField: "gamePlayer",
                            foreignField: "_id",
                            as: "game"
                        }
                    },
                    /* {
                      $unwind: {
                        path: "$game",
                        preserveNullAndEmptyArrays: true
                      }
                    }, */
                    {
                        $lookup: {
                            from: "game",
                            localField: "game.game",
                            foreignField: "_id",
                            as: "gamerole"
                        }
                    },
                    /* {
                      $unwind: {
                        path: "$gamerole",
                        preserveNullAndEmptyArrays: true
                      }
                    }, */
                    {
                        $project: {
                            id: "$_id",
                            type: 1,
                            spin: 1,
                            quantity: 1,
                            gamePlayer: "$gamerole.name",
                            player: {
                                username: "$playerDetail.username",
                                id: "$playerDetail._id"
                            },
                            createdAt: 1,
                            remaining: 1
                                /* _id: 0,
                                remaining: {
                                  $cond: {
                                    if: {
                                      $eq: ["bet", "$_id.type"]
                                    },
                                    then: { $min: "$remainingChips" },
                                    else: { $max: "$remainingChips" }
                                  }
                                } */
                        }
                    }
                ])
                .allowDiskUse(true)
                .exec();
        } catch (error) {
            console.log(
                "Chips Transaction Service error getByChipsTransactionModel",
                error
            );
            return new Error(error);
        }
    },
}