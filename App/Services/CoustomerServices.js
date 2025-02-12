'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const coustomerModel = mongoose.model('customer');
const transactionModel = mongoose.model('transaction')
const cashHistoryModel = mongoose.model('cashHistory')
const cashierReportModel = mongoose.model('cashierReport')

module.exports = {

    createUser: async function(data){
        console.log('createUser Data:', data);
        try {
            return await coustomerModel.create(data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    getCoustomerDatatable: async function(query,start,length){
        try {
            console.log("getCoustomerDatatable",query,start,length);
            return await coustomerModel.find(query).skip(start).limit(length).lean();
        } catch (e) {
            console.log("Error", e);
        }
    },
    getCoustomerCount: async function(query){
        try {
            return await coustomerModel.countDocuments(query);
        } catch (e) {
            console.log("Error", e);
        }
    },
    findOneUser: async function(query){
        try {
            console.log("findOneUser",query);
            return await coustomerModel.findOne(query);
        } catch (e) {
            console.log("Error", e);
        }
    },
    updateCoustomer: async function(condition,query){
        try {
            return await coustomerModel.updateOne(condition,query);
        } catch (e) {
            console.log("Error", e);
        }
    },
    createTransaction: async function(data){
        try{
            return await transactionModel.create(data)
        }catch(e){
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
    createHistory: async function(data){
        try{
            console.log("createHistory",data);
            return await cashHistoryModel.create(data)
        }catch(e){
            console.log("Error", e);
        }
    },
    findOnePurchase:async function(data){
        try{
            return await cashHistoryModel.findOne(data)
        }catch(e){
            console.log("Error", e);
        }
    },
    getCashDatatable: async function(query, length, start) {
        try {
            console.log("getCashDatatable", query);
            return await cashHistoryModel.find(query).skip(start).limit(length).lean();
        } catch (e) {
            console.log("Error", e);
        }
    },
    getCashCount: async function(data) {
        try {
            return await cashHistoryModel.countDocuments(data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    getCashierReportDatatable: async function(query, length, start){
        try{
            return await cashierReportModel.find(query).skip(start).limit(length).lean();
        }catch(e){
            console.log("Error", e);
        }
    },
    getCashierReportCount: async function(data){
        try{
            return await cashierReportModel.countDocuments(data);;
        }catch(e){
            console.log("Error", e);
        }
    },
    getCashierReportDetails: async function(data){
        try{
            return await cashierReportModel.findOne(data).sort({_id:1});
        }catch(e){
            console.log("Error", e);
        }
    },
    getCashierTotalReturn: async function(data){
        try{
            console.log("data",data);
            return await cashierReportModel.aggregate([{$match:data},{$group:{_id:null,totalRedeem:{$sum:"$withdrwAmount"}}}]);
        }catch(e){
            console.log("Error", e);
        }
    },
    getCashierTotalCredit: async function(data){
        try{
            console.log("data",data);
            return await cashierReportModel.aggregate([{$match:data},{$group:{_id:null,totalCredit:{$sum:"$depositAmount"}}}]);
        }catch(e){
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

}