var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var helper = require('../../Helper/helper');
var dateformat = require('dateformat');
const mongoose = require('mongoose');
const crypto = require('crypto');
const passphrase = 'maddyNode@Gamecrio';
const salt = crypto.randomBytes(16);
const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
const moment = require('moment')
const notifier = require('node-notifier');
let randomNumber = []
let bonusReelStuck = {}
let totalBet = 0
let totalWin = 0
let freeSpinCount = 0
let count = 0
let bonusCountTotal = 0
let bounsValue = false
let freeSpin = false
let addedSpin = false

module.exports = {
    customerManagement: async function (req, res) {
        try {
            let setting = await Sys.App.Services.UserServices.getSettings({})
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                customerMangement: 'active',
                role: req.session.details.role,
                chips: setting.chips
            };
            return res.render('customer/customer', data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    customers: async function (req, res) {
        try {
            console.log("req.body", req.query);
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search;

            let query = { role: "customer", userId: mongoose.Types.ObjectId(req.session.details.id) }


            if (req.query.type != "" && req.query.search != '') {
                if (req.query.type == "name") {
                    query["firstName"] = { $regex: '.*' + search + '.*' }
                } else {
                    query["uniqueId"] = { $regex: '.*' + search + '.*' }

                }
            }
            console.log("getCustomers query", typeof query.userId);
            let data = await Sys.App.Services.CustomerServices.getcustomerDatatable(query, start, length);
            let dataCount = await Sys.App.Services.CustomerServices.getcustomerCount(query);
            console.log("dataCount", data);

            var obj = {
                'draw': req.query.draw,
                'recordsTotal': dataCount,
                'recordsFiltered': dataCount,
                'data': data
            };
            res.send(obj);
        } catch (e) {
            console.log("Error", e);
        }
    },
    addcustomer: async function (req, res) {
        try {
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                customerMangement: 'active',
                role: req.session.details.role
            };
            return res.render('customer/addcustomer', data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    drawerMangement: async function (req, res) {
        try {
            let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id })
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                drawerMangement: 'active',
                role: req.session.details.role,
                cashierId: req.session.details.id,
                user: user
            };
            return res.render('cashier/drawer', data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    addAmount: async function (req, res) {
        try {
            console.log("req.body", req.body);
            let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id })
            let finalAmount = 0;
            if (req.body.requestType == "Add") {
                await Sys.App.Services.UserServices.updateUserData({ _id: req.session.details.id }, { $inc: { cash: Number(req.body.chips) } })
                finalAmount = Number(req.body.chips)
                await Sys.App.Services.UserServices.createBalanceReport({
                    intialAmount: user.cash,
                    withdrwAmount: (req.body.requestType != "Add") ? Number(req.body.chips) : 0,
                    depositAmount: (req.body.requestType == "Add") ? Number(req.body.chips) : 0,
                    transactionId: Math.floor(100000 + Math.random() * 900000),
                    type: (req.body.requestType == "Add") ? "deposit" : "withdraw",
                    user: req.session.details.id
                })
                req.session.details.cash = user.cash + finalAmount;
                return res.redirect('/drawer');
            } else {
                if (req.session.details.cash >= Number(req.body.chips) && req.session.details.cash > 0) {
                    let setting = await Sys.App.Services.UserServices.getSettings({})
                    notifier.notify({
                        title: 'Title',
                        message: 'Total withdrawable amount $ ' + Number(req.body.chips) / setting.chips
                    });
                    await Sys.App.Services.UserServices.updateUserData({ _id: req.session.details.id }, { $inc: { cash: -Number(req.body.chips) } })
                    finalAmount = -Number(req.body.chips)
                    await Sys.App.Services.UserServices.createBalanceReport({
                        intialAmount: user.cash,
                        withdrwAmount: (req.body.requestType != "Add") ? Number(req.body.chips) : 0,
                        depositAmount: (req.body.requestType == "Add") ? Number(req.body.chips) : 0,
                        transactionId: Math.floor(100000 + Math.random() * 900000),
                        type: (req.body.requestType == "Add") ? "deposit" : "withdraw",
                        user: req.session.details.id
                    })
                    req.session.details.cash = user.cash + finalAmount;
                    return res.redirect('/drawer');
                } else {
                    req.flash('error', `Can't deduct requested amount,the balance has insufficient amount`);
                    return res.redirect('/drawer');
                }
                // await Sys.App.Services.UserServices.updateCashierData({user:user.userId},{})
            }

        } catch (e) {
            console.log("Error", e);
        }
    },
    getCashierBalanceData: async function (req, res) {
        try {
            console.log("req.session.details.id", req.session.details.id);
            let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id })
            let cashierData = await Sys.App.Services.UserServices.findCashierData({ user: mongoose.Types.ObjectId(req.session.details.id) })
            let initialAmount = (cashierData.length) ? cashierData[cashierData.length - 1].intialAmount : 0
            let addedAmount = (cashierData.length) ? cashierData[cashierData.length - 1].depositAmount : 0
            let obj = {
                status: "success",
                initialAmount: initialAmount,
                addedAmount: addedAmount,
                balance: user.cash
            }
            req.session.details.cash = user.cash
            res.send(obj)
            console.log("cashierData", user, initialAmount, addedAmount);
        } catch {
            console.log("error", e);
        }
    },
    // getBalance:async function(req,res){
    //     try{
    //         console.log("getBalance req.body", req.body);
    //         let customer = await Sys.App.Services.CustomerServices.findOneUser({uniqueId:req.body.uniqueId})
    //         let user = await Sys.App.Services.UserServices.getSingleUserData({_id:customer.userId})
    //         if(user.cash > )
    //     }catch(e){
    //         console.log("error",e); 
    //     }
    // },
    addPostcustomer: async function (req, res) {
        try {
            console.log("req.body addPostcustomer", req.body);
            let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id })
            let userIdObject = user.userIdObject;
            userIdObject.cashierId = mongoose.Types.ObjectId(req.session.details.id);
            let customer = await Sys.App.Services.CustomerServices.createUser({
                userId: req.session.details.id,
                userIdObject: userIdObject,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.mail,
                role: 'customer',
                mobile: req.body.phone,
                license: req.body.license,
                uniqueId: req.body.pin,
                timeZone: user.timeZone,
                comunityPrice: user.comunityPrice,
                gender: req.body.gender
            })
            userIdObject.customerId = mongoose.Types.ObjectId(customer._id);
            await Sys.Game.Common.Services.GameService.createBetReport({
                customerId: mongoose.Types.ObjectId(customer._id),
                userIdObject: userIdObject,
                pointsPlayed: 0,
                lastWin: "0",
                winLines: [],
                customerName: customer.firstName,
                customerEmail: customer.email,
                customerUniqueId: customer.uniqueId,
                betType: "bet"
            })
            if (customer) {
                return res.send("success")
            }
        } catch (e) {
            console.log("Error", e);
        }
    },
    viewcustomer: async function (req, res) {
        try {
            console.log("req.body", req.body);
            let customer = await Sys.App.Services.CustomerServices.findOneUser({ _id: req.body.userId })
            console.log("customer", customer);
            if (customer) {
                let obj = {
                    status: "success",
                    pinID: customer.uniqueId,
                    license: customer.license,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    mobile: customer.mobile,
                    mail: customer.email,
                    gender: customer.gender,
                    userId: customer._id,
                    withdrawableChips: customer.withdrawableChips,
                    nonWithdrawableChips: customer.nonWithdrawableChips
                }




                return res.send(obj)

            }
        } catch (e) {
            console.log("Error", e);
        }
    },
    redeemAmount: async function (req, res) {
        try {
            console.log("redeemAmount", req.body);
            let customer = await Sys.App.Services.CustomerServices.findOneUser({ uniqueId: req.body.uniqueId })
            console.log("customer", customer);
            let setting = await Sys.App.Services.UserServices.getSettings({})
            console.log("setting", setting.chips, req.body.amount);
            let amount = Number(req.body.amount)
            console.log("amount", amount);
            let obj = {}
            if (customer && customer.withdrawableChips >= amount) {
                await Sys.App.Services.CustomerServices.updatecustomer({ _id: customer._id }, { $inc: { withdrawableChips: -amount } })
                obj = {
                    status: "success",
                    msg: "Chips redeemed Successfully",
                    withdrawedChips: customer.withdrawableChips - amount
                }
                let userIdObject = user.userIdObject;
                userIdObject.customerId = mongoose.Types.ObjectId(customer.id);
                await Sys.App.Services.CustomerServices.createHistory({
                    from: customer._id,
                    to: customer.userId,
                    type: "withdraw",
                    userIdObject: userIdObject,
                    customerName: customer.firstName + ' ' + customer.lastName,
                    amount: amount,
                    transactionId: Math.floor(100000 + Math.random() * 900000)
                })
            } else {
                obj = {
                    status: "error",
                    msg: "In sufficient withdrawable chips available"
                }
            }
            return res.send(obj)

        } catch (e) {
            console.log("Error", e);
        }
    },
    viewSinglecustomer: async function (req, res) {
        try {
            console.log("viewSinglecustomer req.body", req.body);
            let setting = await Sys.App.Services.UserServices.getSettings({})
            let obj = {}
            let customer = await Sys.App.Services.CustomerServices.findOneUser({ uniqueId: req.body.uniqueId })
            console.log("customer", customer);
            if (customer) {
                let cashier = await Sys.App.Services.UserServices.getSingleUserData({ _id: customer.userId })
                console.log("cashier", cashier);
                let shop = await Sys.App.Services.UserServices.getSingleUserData({ _id: cashier.userId })
                console.log("Number(req.body.amount)", setting.chips * Number(req.body.amount), cashier.cash < Number(req.body.amount));
                if (cashier.cash < Number(req.body.amount)) {
                    obj = {
                        status: "error",
                        cashierName: cashier.name,
                        shopName: shop.name,
                    }
                } else {
                    obj = {
                        status: "success",
                        cashierName: cashier.name,
                        shopName: shop.name,
                    }
                }
                return res.send(obj);
            }
        } catch (e) {
            console.log("Error", e);
        }
    },
    editcustomer: async function (req, res) {
        try {
            console.log("req.body editPostcustomer", req.body);
            let customer = await Sys.App.Services.CustomerServices.updatecustomer({ _id: req.body.userId }, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.mail,
                mobile: req.body.phone,
                license: req.body.license,
                gender: req.body.gender
            })
            return res.send("success")
        } catch (e) {
            console.log("Error", e)
        }
    },

    //update status for customer api in admin penel 


    addChips: async function (req, res) {
        try {
            console.log("addChips data", req.body);
            //   let setting = await Sys.App.Services.UserServices.getSettings({})
            //   let amount = Number(req.body.totalAmount)
            console.log("amount", Number(req.body.totalAmount));
            let updateChips = await Sys.App.Services.CustomerServices.updatecustomer({ uniqueId: req.body.userPin }, { $inc: { nonWithdrawableChips: Number(req.body.totalAmount) } })
            let user = await Sys.App.Services.CustomerServices.findOneUser({ uniqueId: req.body.userPin })

            console.log("updateChips", updateChips);
            if (updateChips) {
                await Sys.App.Services.UserServices.updateUserData({ _id: user.userId }, { $inc: { cash: -Number(req.body.totalAmount) } })
                let cashier = await Sys.App.Services.UserServices.getSingleUserData({ _id: user.userId })
                console.log("cashier", cashier);
                req.session.details.cash = cashier.cash
                console.log("daat");
                let userIdObject = user.userIdObject;
                userIdObject.customerId = mongoose.Types.ObjectId(user.id);
                await Sys.App.Services.CustomerServices.createTransaction({
                    customerId: user._id,
                    userIdObject: userIdObject,
                    description: "deposit",
                    transaction_chips: Number(req.body.totalAmount),
                    transaction_amount: Number(req.body.totalAmount),
                    transaction_type: "purchase"
                })

                await Sys.App.Services.CustomerServices.createHistory({
                    from: user.userId,
                    to: user._id,
                    type: "deposit",
                    userIdObject: userIdObject,
                    customerName: user.firstName + ' ' + user.lastName,
                    amount: Number(req.body.totalAmount),
                    transactionId: Math.floor(100000 + Math.random() * 900000)
                })
                return res.send("success")
            }
        } catch (e) {
            console.log("error", e);
        }
    },
    revertPurchase: async function (req, res) {
        try {
            console.log("revertPurchase", req.body);
            let customer = await Sys.App.Services.CustomerServices.findOneUser({ uniqueId: req.body.userPin })
            console.log("customer", customer);
            let lastPurchaseHistory = await Sys.App.Services.CustomerServices.findOnePurchase({ to: customer._id, type: "deposit" })
            console.log("lastPurchaseHistory", lastPurchaseHistory);
            if (customer) {
                return res.send({ status: "success", user: { pinId: customer.uniqueId, customerName: customer.firstName + ' ' + customer.lastName, purchaseDate: moment(lastPurchaseHistory.createdAt).format('DD/MM/YYYY hh:mm a'), compsAmount: "5", entries: lastPurchaseHistory.amount } })
            }
        } catch (e) {
            console.log("error", e);
        }
    },
    revertAmount: async function (req, res) {
        try {
            let obj = {}
            let customer = await Sys.App.Services.CustomerServices.findOneUser({ uniqueId: req.body.userPin })
            console.log("customer", customer);
            let lastPurchaseHistory = await Sys.App.Services.CustomerServices.findOnePurchase({ to: customer._id, type: "deposit" })
            console.log("lastPurchaseHistory", lastPurchaseHistory);
            if (customer) {
                if (customer.chips < lastPurchaseHistory.amount) {
                    obj = {
                        status: "error",
                        message: "This user is unable to withdraw due to insufficient credit."
                    }
                } else {
                    await Sys.App.Services.CustomerServices.updatecustomer({ uniqueId: req.body.userPin }, { $inc: { chips: -lastPurchaseHistory.amount } });
                    let userIdObject = user.userIdObject;
                    userIdObject.customerId = mongoose.Types.ObjectId(customer.id);
                    await Sys.App.Services.CustomerServices.createHistory({
                        from: customer._id,
                        to: customer.userId,
                        type: "revert",
                        userIdObject: userIdObject,
                        amount: amount,
                        transactionId: Math.floor(100000 + Math.random() * 900000)
                    })
                }
            } else {
                obj = {
                    status: "error",
                    message: "This customer has not been located."
                }
            }
            return res.send(obj)
        } catch (e) {
            console.log("error", e);
        }
    },
    chipsReport: async function (req, res) {
        try {
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                chipsReport: 'active',
                report: 'active',
                role: req.session.details.role,
            };
            return res.render('report/chipsHistory', data);
        } catch (e) {
            console.log("error", e);
        }
    },
    selfReport: async function (req, res) {
        try {
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                selfReport: 'active',
                report: 'active',
                role: req.session.details.role,
            };
            return res.render('report/selfReports', data);
        } catch (e) {
            console.log("error", e);
        }
    },
    getCashHistory: async function (req, res) {
        try {
            let query = { $or: [{ from: req.session.details.id }, { to: req.session.details.id }] }
            console.log("getCashHistory", req.query);
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;
            if (req.query.startdate != "" && req.query.enddate != '') {
                // Convert start and end dates to UTC midnight and end of the day
                let startdate = req.query.startdate;
                const [startDay, startMonth, startYear] = startdate.split('/');
                const startDate = new Date(startYear, startMonth - 1, startDay);
                startDate.setHours(0, 0, 0, 0);
                let enddate = req.query.enddate
                const [day, month, year] = enddate.split('/');
                const endDate = new Date(year, month - 1, day);

                endDate.setHours(23, 59, 59, 999)
                console.log("startDate, endDate", startDate, endDate);

                // Use $expr, $gte, and $lte to query the date range
                query.createdAt = {
                    $gte: startDate,
                    $lte: endDate,
                };
            }
            console.log("getDistributors query", query);
            let data = await Sys.App.Services.CustomerServices.getCashDatatable(query, length, start);
            let dataCount = await Sys.App.Services.CustomerServices.getCashCount(query);
            var obj = {
                'draw': req.query.draw,
                'recordsTotal': dataCount,
                'recordsFiltered': dataCount,
                'data': data
            };
            res.send(obj);
            console.log("dataCount", data, dataCount);
        } catch (e) {
            console.log("error", e);
        }
    },
    getSelfReportData: async function (req, res) {
        try {
            console.log("getSelfReportData data", req.query);
            let query = { user: req.session.details.id }
            let intitalAmountQuery = { user: mongoose.Types.ObjectId(req.session.details.id), type: 'withdraw' }
            let creditAmountQuery = { user: mongoose.Types.ObjectId(req.session.details.id), type: 'deposit' }
            console.log("getCashHistory", req.query);
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;
            if (req.query.startdate != "" && req.query.enddate != '') {
                // Convert start and end dates to UTC midnight and end of the day
                let startdate = req.query.startdate;
                const [startDay, startMonth, startYear] = startdate.split('/');
                const startDate = new Date(startYear, startMonth - 1, startDay);
                startDate.setHours(0, 0, 0, 0);
                let enddate = req.query.enddate
                const [day, month, year] = enddate.split('/');
                const endDate = new Date(year, month - 1, day);

                endDate.setHours(23, 59, 59, 999)
                console.log("startDate, endDate", startDate, endDate);

                // Use $expr, $gte, and $lte to query the date range
                query.createdAt = {
                    $gte: startDate,
                    $lte: endDate,
                };
                intitalAmountQuery.createdAt = {
                    $gte: startDate,
                    $lte: endDate,
                };
                creditAmountQuery.createdAt = {
                    $gte: startDate,
                    $lte: endDate,
                };
            }
            console.log("getDistributors query", query, intitalAmountQuery);
            let data = await Sys.App.Services.CustomerServices.getCashierReportDatatable(query, length, start);
            let dataCount = await Sys.App.Services.CustomerServices.getCashierReportCount(query);
            let intialAmount = await Sys.App.Services.CustomerServices.getCashierReportDetails(query);
            let totalReturn = await Sys.App.Services.CustomerServices.getCashierTotalReturn(intitalAmountQuery);
            let totalCredit = await Sys.App.Services.CustomerServices.getCashierTotalCredit(creditAmountQuery);
            console.log("totalCredit", totalCredit, totalReturn, totalCredit);
            var obj = {
                'draw': req.query.draw,
                'recordsTotal': dataCount,
                'recordsFiltered': dataCount,
                'data': data,
                'intialAmount': (intialAmount.intialAmount == undefined || intialAmount.intialAmount == null) ? 0 : intialAmount.intialAmount,
                'totalReturn': (totalReturn.length > 0) ? totalReturn[0].totalRedeem : '0',
                'totalCredit': (totalCredit.length > 0) ? totalCredit[0].totalCredit : '0'
            };
            res.send(obj);
            console.log("dataCount===>", data, dataCount);
        } catch (e) {
            console.log("getSelfReportData error", e);
        }
    },

    spin: async function (req, res) {
        try {
            for (let spiiin = 0; spiiin < 1000000; spiiin++) {
                let winningLine = []
                // data = JSON.parse(data)
                let gameSymbol = await Sys.Game.Common.Services.GameService.findSymbols({ gameId: mongoose.Types.ObjectId("663b7251096c36bd9138880a") })//data.gameId
                let lines = await Sys.Game.Common.Services.GameService.findLines({ game: mongoose.Types.ObjectId("663b7251096c36bd9138880a") }) //mongoose.Types.ObjectId(data.gameId)
                let message = 'GOOD LUCK!'
                let totalLines = []
                let reelmaping = []
                let reel = []
                // let bounsValue = false // comment
                // let freeSpin = false // comment
                // let addedSpin = false // comment
                let winningAmount = []
                let totalAmount = 0
                // let freeSpinCount = 0
                for (let singleLine = 0; singleLine < lines.length; singleLine++) {
                    totalLines.push(lines[singleLine].matrix)
                }
                let reel_one = [
                    9,
                    7,
                    2,
                    1,
                    4,
                    6,
                    8,
                    2,
                    1,
                    3,
                    8,
                    4,
                    6,
                    5,
                    0,
                    4,
                    10,
                    6,
                    5,
                    0,
                    7,
                    2
                ]
                let reel_two = [
                    9,
                    4,
                    5,
                    7,
                    6,
                    2,
                    0,
                    7,
                    8,
                    10,
                    4,
                    0,
                    7,
                    2,
                    4,
                    3,
                    1,
                    6,
                    5,
                    3,
                    4,
                    5
                ]
                let reel_three = [
                    9,
                    8,
                    0,
                    6,
                    5,
                    4,
                    1,
                    5,
                    0,
                    2,
                    1,
                    3,
                    4,
                    10,
                    7,
                    1,
                    5,
                    3,
                    6,
                    7,
                    8,
                    0
                ]
                let reel_four = [
                    9,
                    5,
                    3,
                    2,
                    0,
                    7,
                    4,
                    6,
                    1,
                    5,
                    10,
                    8,
                    7,
                    3,
                    2,
                    7,
                    4,
                    0,
                    6,
                    1,
                    5,
                    3,
                ]
                let reel_five = [
                    9,
                    1,
                    6,
                    2,
                    5,
                    4,
                    3,
                    0,
                    7,
                    1,
                    4,
                    10,
                    0,
                    6,
                    2,
                    7,
                    0,
                    2,
                    8,
                    7,
                    1,
                    6,
                ]
                let randomNearNumbers = getRandomNearNumbers(reel_one, gameSymbol);
                let randomNearNumbers1 = getRandomNearNumbers(reel_two, gameSymbol);
                let randomNearNumbers2 = getRandomNearNumbers(reel_three, gameSymbol);
                let randomNearNumbers3 = getRandomNearNumbers(reel_four, gameSymbol);
                let randomNearNumbers4 = getRandomNearNumbers(reel_five, gameSymbol);

                console.log("randomNearNumbers", randomNearNumbers.result);
                console.log("randomNearNumbers1", randomNearNumbers1.result);
                console.log("randomNearNumbers2", randomNearNumbers2.result);
                console.log("randomNearNumbers3", randomNearNumbers3.result);
                console.log("randomNearNumbers4", randomNearNumbers4.result);
                let countOfBonus = {}
                // if (!data.bounsValue) { //comment
                if (!bounsValue) {
                    reelmaping.push(
                        [randomNearNumbers.result[0], randomNearNumbers1.result[0], randomNearNumbers2.result[0], randomNearNumbers3.result[0], randomNearNumbers4.result[0]]
                        , [randomNearNumbers.result[1], randomNearNumbers1.result[1], randomNearNumbers2.result[1], randomNearNumbers3.result[1], randomNearNumbers4.result[1]]
                        , [randomNearNumbers.result[2], randomNearNumbers1.result[2], randomNearNumbers2.result[2], randomNearNumbers3.result[2], randomNearNumbers4.result[2]]
                    )
                    reel.push(randomNearNumbers.result, randomNearNumbers1.result, randomNearNumbers2.result, randomNearNumbers3.result, randomNearNumbers4.result)
                    // console.log("reel", reel);
                    countOfBonus = countArraysContainingValueWithIndices(reel)
                    console.log("countOfBonus1", countOfBonus);
                    if (countOfBonus.count == 2) {
                        bonusCountTotal++
                        bounsValue = true
                        // freeSpin = true
                    } else if (countOfBonus.count >= 3 && freeSpinCount <= 0) {

                        if (countOfBonus.count == 3) {
                            count++
                            winningAmount.push(gameSymbol[9].three_time)
                            if (freeSpin) {
                                totalAmount += gameSymbol[9].three_time * 3
                            }
                            bonusReelStuck = {}
                        } else if (countOfBonus.count == 4) {
                            count++
                            winningAmount.push(gameSymbol[9].four_time)
                            if (freeSpin) {
                                totalAmount += gameSymbol[9].four_time * 3
                            }
                            bonusReelStuck = {}

                        } else if (countOfBonus.count == 5) {
                            count++
                            winningAmount.push(gameSymbol[9].five_time)
                            if (freeSpin) {
                                totalAmount += gameSymbol[9].five_time * 3
                            }

                            bonusReelStuck = {}

                        }
                        freeSpin = true
                        freeSpinCount = 15
                    } else if (countOfBonus.count >= 3 && freeSpinCount > 0) {
                        count++
                        if (countOfBonus.count == 3) {
                            count++
                            winningAmount.push(gameSymbol[9].three_time)
                            if (freeSpin) {
                                totalAmount += gameSymbol[9].three_time * 3
                            }
                            bonusReelStuck = {}
                        } else if (countOfBonus.count == 4) {
                            count++
                            winningAmount.push(gameSymbol[9].four_time)
                            if (freeSpin) {
                                totalAmount += gameSymbol[9].four_time * 3
                            }
                            bonusReelStuck = {}

                        } else if (countOfBonus.count == 5) {
                            count++
                            winningAmount.push(gameSymbol[9].five_time)
                            if (freeSpin) {
                                totalAmount += gameSymbol[9].five_time * 3
                            }

                            bonusReelStuck = {}

                        }
                        freeSpinCount += 10
                        addedSpin = true
                    }
                } else
                    // console.log("data.bounsValue", data.bounsValue);
                    // if (data.bounsValue) { //comment
                    if (bounsValue) {
                        // console.log("array[0]",countOfBonus);
                        totalBet -= 30
                        for (let bonus = 0; bonus < bonusReelStuck.indices.length; bonus++) {
                            if (bonusReelStuck.indices[bonus] == 0) {
                                randomNearNumbers.result = bonusReelStuck.array[0][0]
                            } else if (bonusReelStuck.indices[bonus] == 1) {
                                randomNearNumbers1.result = bonusReelStuck.array[0][1]
                            } else if (bonusReelStuck.indices[bonus] == 2) {
                                randomNearNumbers2.result = bonusReelStuck.array[0][2]
                            } else if (bonusReelStuck.indices[bonus] == 3) {
                                randomNearNumbers3.result = bonusReelStuck.array[0][3]
                            } else if (bonusReelStuck.indices[bonus] == 4) {
                                randomNearNumbers4.result = bonusReelStuck.array[0][4]
                            }

                        }
                        let countOfExtraBonus = countArraysContainingValueWithIndices([randomNearNumbers.result, randomNearNumbers1.result, randomNearNumbers2.result, randomNearNumbers3.result, randomNearNumbers4.result])
                        console.log("countOfBonus2", countOfExtraBonus);
                        countOfBonus = countOfExtraBonus
                        if (countOfExtraBonus.count == 2) {
                            winningAmount.push(gameSymbol[9].two_time)
                            if (freeSpin) {
                                totalAmount += gameSymbol[9].two_time * 3
                            }
                            bounsValue = false //remove
                        } else if (countOfExtraBonus.count >= 3 && freeSpinCount <= 0) {
                            freeSpin = true
                            freeSpinCount = 15
                            if (countOfBonus.count == 3) {
                                count++
                                winningAmount.push(gameSymbol[9].three_time)
                                if (freeSpin) {
                                    totalAmount += gameSymbol[9].three_time * 3
                                }
                                bonusReelStuck = {}
                            } else if (countOfExtraBonus.count == 4) {
                                count++
                                winningAmount.push(gameSymbol[9].four_time)
                                if (freeSpin) {
                                    totalAmount += gameSymbol[9].four_time * 3
                                }
                                bonusReelStuck = {}

                            } else if (countOfExtraBonus.count == 5) {
                                count++
                                winningAmount.push(gameSymbol[9].five_time)
                                if (freeSpin) {
                                    totalAmount += gameSymbol[9].five_time * 3
                                }

                                bonusReelStuck = {}

                            }
                            bounsValue = false
                        } else if (countOfExtraBonus.count >= 3 && freeSpinCount > 0) {
                            count++
                            addedSpin = true
                            if (countOfBonus.count == 3) {
                                count++
                                winningAmount.push(gameSymbol[9].three_time)
                                if (freeSpin) {
                                    totalAmount += gameSymbol[9].three_time * 3
                                }
                                bonusReelStuck = {}
                            } else if (countOfExtraBonus.count == 4) {
                                count++
                                winningAmount.push(gameSymbol[9].four_time)
                                if (freeSpin) {
                                    totalAmount += gameSymbol[9].four_time * 3
                                }
                                bonusReelStuck = {}

                            } else if (countOfExtraBonus.count == 5) {
                                count++
                                winningAmount.push(gameSymbol[9].five_time)
                                if (freeSpin) {
                                    totalAmount += gameSymbol[9].five_time * 3
                                }

                                bonusReelStuck = {}

                            }
                            bounsValue = false
                            freeSpinCount += 10
                        }
                        // bounsValue = false //comment
                        bonusReelStuck = {}
                        reelmaping.push(
                            [randomNearNumbers.result[0], randomNearNumbers1.result[0], randomNearNumbers2.result[0], randomNearNumbers3.result[0], randomNearNumbers4.result[0]]
                            , [randomNearNumbers.result[1], randomNearNumbers1.result[1], randomNearNumbers2.result[1], randomNearNumbers3.result[1], randomNearNumbers4.result[1]]
                            , [randomNearNumbers.result[2], randomNearNumbers1.result[2], randomNearNumbers2.result[2], randomNearNumbers3.result[2], randomNearNumbers4.result[2]]
                        )
                        reel.push(randomNearNumbers.result, randomNearNumbers1.result, randomNearNumbers2.result, randomNearNumbers3.result, randomNearNumbers4.result)
                    }
                console.log("reelmaping1", reelmaping);
                console.log("reelmaping2", reel);
                for (let i = 0; i < totalLines.length; i++) {
                    const totalLine = totalLines[i];
                    let functioncall = findMatchingAliments(totalLine, reelmaping, reel);
                    if (functioncall != undefined) {
                        // console.log("functioncall", functioncall, totalLines[i]);
                        // console.log("gameSymbol", gameSymbol[functioncall.targetSymbol]);
                        let payout = 0
                        let betAmount = 1
                        if (functioncall.doubleCount == 1 || functioncall.doubleCount == 2) {

                            if (functioncall.targetSymbolOccurence == 2) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].two_time
                            } else if (functioncall.targetSymbolOccurence == 3) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].three_time
                            } else if (functioncall.targetSymbolOccurence == 4) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].four_time
                            } else if (functioncall.targetSymbolOccurence == 5) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].five_time
                            }
                            payout = payout * 2
                        } else if (functioncall.doubleCount != 1 || functioncall.doubleCount != 2) {
                            if (functioncall.targetSymbolOccurence == 2) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].two_time
                            } else if (functioncall.targetSymbolOccurence == 3) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].three_time
                            } else if (functioncall.targetSymbolOccurence == 4) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].four_time
                            } else if (functioncall.targetSymbolOccurence == 5) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].five_time
                            }
                            console.log("payout", payout);

                        }
                        // else if(data.freeSpin){
                        else if (freeSpin) {
                            if (functioncall.targetSymbolOccurence == 2) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].two_time * 3
                            } else if (functioncall.targetSymbolOccurence == 3) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].three_time * 3
                            } else if (functioncall.targetSymbolOccurence == 4) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].four_time * 3
                            } else if (functioncall.targetSymbolOccurence == 5) {
                                payout = betAmount * gameSymbol[functioncall.targetSymbol].five_time * 3
                            }
                        }
                        if (payout !== 0) {
                            totalAmount += payout
                            winningAmount.push(payout)
                            winningLine.push(totalLines[i])
                        }
                    }


                }
                console.log("bonusReelStuck", bonusReelStuck);
                console.log("winningAmount", winningAmount, winningLine);
                console.log("randomNearNumbers", randomNearNumbers.result);
                console.log("randomNearNumbers1", randomNearNumbers1.result);
                console.log("randomNearNumbers2", randomNearNumbers2.result);
                console.log("randomNearNumbers3", randomNearNumbers3.result);
                console.log("randomNearNumbers4", randomNearNumbers4.result);
                console.log("totalAmount", totalAmount);


                let index = {
                    reelOne: randomNearNumbers.symbolData,
                    reelTwo: randomNearNumbers1.symbolData,
                    reelThree: randomNearNumbers2.symbolData,
                    reelFour: randomNearNumbers3.symbolData,
                    reelFive: randomNearNumbers4.symbolData,
                    bounsValue: bounsValue,
                    freeSpin: freeSpin,
                    addedSpin: addedSpin,
                    line: winningLine,
                    winningAmount: winningAmount,
                    bonusCount: countOfBonus.count,
                    lastWinPrize: totalAmount
                }
                if (freeSpinCount <= 0) {

                    freeSpin = false
                }
                // if(!data.freeSpin){ //comment
                if (!freeSpin && freeSpinCount <= 0) {
                    totalBet += 30
                } else if (freeSpin && freeSpinCount > 0) {
                    if (freeSpinCount > 0) {
                        freeSpinCount--
                    }
                }
                console.log("freeSpinCount", freeSpinCount);
                totalWin += totalAmount
                let rtp = (totalWin / totalBet) * 100
                console.log("rtp", rtp);
                console.log("totalWin", totalWin);
                console.log("totalBet", totalBet);
                console.log("count", count);
                console.log("randomNumber", randomNumber);
                console.log("bonusCountTotal", bonusCountTotal);
                console.log(spiiin);
                // return {
                //     status: 'success',
                //     result: {
                //         index: index,
                //         rtp:rtp
                //     },
                //     message: message,
                //     statusCode: 200
                // }
            }
        } catch (e) {
            console.log("Game-->Common-->Controllers-->GameController-->spin", e);
        }
    },
    betReport: async function (req, res) {
        try {
            let id = (req.params.id != undefined && req.params.id != "") ? req.params.id : null;
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                betReport: 'active',
                report: 'active',
                role: req.session.details.role,
                id: id,
            };
            return res.render('report/betReports', data);
        } catch (e) {
            console.log("error", e);
        }
    },


    customer_list: async function (req, res) {
        console.log("666666", req.body);

        try {
            const { limit = 10, page = 1, globlesearch = "", fromDate, toDate } = req.body;
            const query = {};

            if (globlesearch) {
                let searchDate;
                try {
                    searchDate = new Date(globlesearch); // Convert input to Date object
                } catch (error) {
                    searchDate = null; // Invalid date input
                }

                // Initialize search conditions
                query.$or = [
                    { name: { $regex: globlesearch, $options: "i" } },
                    { email: { $regex: globlesearch, $options: "i" } }
                ];

                // Check if globlesearch is a valid number
                const searchNumber = Number(globlesearch);
                if (!isNaN(searchNumber)) {
                    query.$or.push({ balance: { $eq: searchNumber } });
                }

                // If the search term is a valid date, add date-based filtering
                if (!isNaN(searchDate.getTime())) { // Check if it's a valid date
                    const nextDay = new Date(searchDate);
                    nextDay.setDate(nextDay.getDate() + 1); // Move to the next day for range search

                    query.$or.push({
                        createdAt: { $gte: searchDate, $lt: nextDay }
                    });
                }
            }

            // Validate and parse dates correctly
            const isValidDate = (dateStr) => {
                const date = new Date(dateStr);
                return !isNaN(date.getTime()); // Ensure it's a valid date
            };

            // Initialize query

            // Ensure valid `fromDate`
            if (fromDate && isValidDate(fromDate)) {
                query.createdAt = { $gte: new Date(fromDate) };
            }

            // Ensure valid `toDate`
            if (toDate && isValidDate(toDate)) {
                query.createdAt = query.createdAt || {};
                query.createdAt.$lt = new Date(toDate);
            }

            // If both dates are invalid, remove `createdAt`
            if (!isValidDate(fromDate) && !isValidDate(toDate)) {
                delete query.createdAt;
            }

            console.log("Updated Query:", JSON.stringify(query, null, 2));


            // Log the query to verify
            console.log(JSON.stringify(query, null, 2), "Updated Query");


            console.log(query, "Updated Query");


            console.log(query, "query");
            try {
                let data = await Sys.App.Services.CustomerServices.getCustomerlisting(query, limit, page);
                let dataCount = await Sys.App.Services.CustomerServices.getcustomerCount(query);
                var obj = {
                    cusromer: data,
                    customer_count: dataCount
                };
                res.send(obj);
                console.log("dataCount", data, dataCount);
            } catch (error) {
                console.log("Error fetching customer data", error);
                res.status(500).json({ success: false, message: "Server Error", error });
            }
        } catch (error) {
            console.log(error, "error");

            res.status(500).json({ success: false, message: "Server Error", error });
        }

    },

    updatestatus: async function (req, res) {
        try {
            console.log("req.body editPostcustomer", req.body);
            let customer = await Sys.App.Services.CustomerServices.updatecustomer({ _id: req.body.userId }, {
                status: req.body.status
            })
            return res.send({ status: 200, msg: "status updated successfully" })
        } catch (e) {
            console.log("Error", e)
        }
    },
    customerBetReport: async function (req, res) {
        try {
            let id = (req.params.id != undefined && req.params.id != "") ? req.params.id : null;
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                customerMangement: 'active',
                role: req.session.details.role,
                id: id
            };
            return res.render('report/betReports', data);
        } catch (e) {
            console.log("error", e);
        }
    },

    getBetReportData: async function (req, res) {
        try {
            console.log("id=====================================>", req.session.details.id);

            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search;
            let query = {}
            let date = {};

            if (req.query.id != null && req.query.id != undefined && req.query.id != "") {
                let id = req.query.id;
                query = { "userIdObject.cashierId": { $eq: mongoose.Types.ObjectId(id) } }
            } else {
                query = { "userIdObject.cashierId": { $eq: mongoose.Types.ObjectId(req.session.details.id) } }
            }
            if (search.value != undefined && search.value != '') {
                query.$or = [
                    { firstName: { '$regex': search.value } },
                    { lastName: { '$regex': search.value } },

                ]
            }


            if (req.query.startdate != "" && req.query.enddate != '') {
                // Convert start and end dates to UTC midnight and end of the day
                let startdate = req.query.startdate;
                const [startDay, startMonth, startYear] = startdate.split('/');
                const startDate = new Date(startYear, startMonth - 1, startDay);
                startDate.setHours(0, 0, 0, 0);
                let enddate = req.query.enddate
                const [day, month, year] = enddate.split('/');
                const endDate = new Date(year, month - 1, day);
                endDate.setHours(23, 59, 59, 999)
                console.log("startDate, endDate", startDate, endDate);
                // Use $expr, $gte, and $lte to query the date range
                date.createdAt = {
                    $gte: startDate,
                    $lte: endDate,
                }
            }

            console.log("query=========>", query);

            let data = await Sys.App.Services.CustomerServices.getBetReport(query, length, start, date)
            console.log("data=>>>>>", data);
            let dataCount = await Sys.App.Services.CustomerServices.getBetReportCount(query)
            var obj = {
                'draw': req.query.draw,
                'recordsTotal': (dataCount[0] == undefined) ? 0 : dataCount[0].count,
                'recordsFiltered': (dataCount[0] == undefined) ? 0 : dataCount[0].count,
                'data': data,
            };
            console.log("obj===>", obj);
            res.send(obj);
        } catch (e) {
            console.log("getSelfReportData error", e);
        }
    },
    customerProfile: async function (req, res) {
        let userData = await Sys.App.Services.CustomerServices.getcustomer({ "_id": req.params.id });
        console.log(userData[0]);
        data = {
            App: Sys.Config.App.details,
            error: req.flash("error"),
            success: req.flash("success"),
            // shopBetReport: "active",
            // report: "active",
            role: req.session.details.role,
            userData: userData[0]
        }
        res.render("customer/profile", data)
    }



}


function isBcryptHash(value) {
    // Regular expression to match bcrypt hashes
    const bcryptHashRegex = /^\$2[aby]\$.{56}$/;

    return bcryptHashRegex.test(value);
}

function getRandomIndexWithBias(arr) {
    const length = arr.length;
    if (length <= 1) return 0;

    // Define weights for each index. Assign lower weights to indices 0, 20, and 21.
    let weights = Array(length).fill(1); // Default weight of 1 for all indices

    // Adjust weights for specific indices
    if (length > 1) weights[0] = 0.6; // Lower probability for index 0
    if (length > 20) weights[20] = 0.6; // Lower probability for index 20
    if (length > 21) weights[21] = 0.6; // Lower probability for index 21

    // Create cumulative distribution
    const cumulativeWeights = [];
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        cumulativeWeights[i] = sum;
    }

    // Generate a random number in the range [0, sum)
    const randomNum = Math.random() * sum;

    // Find the index corresponding to the random number
    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (randomNum < cumulativeWeights[i]) {
            return i;
        }
    }

    return length - 1; // Fallback in case of rounding issues
}

function getRandomNearNumbers(arr, symbol) {
    const result = [];
    let symbolData = [];

    // Choose a random starting index with bias
    const startIndex = getRandomIndexWithBias(arr);

    // Add the three consecutive numbers starting from the random index to the result
    if (startIndex >= arr.length - 1) {
        // If the starting index is at or near the end of the array
        result.push(arr[startIndex], arr[startIndex + 1] || arr[0], arr[0]);
    } else if (startIndex >= arr.length - 2) {
        result.push(arr[startIndex], arr[startIndex + 1], arr[0]);
    } else {
        // Otherwise, add the three consecutive numbers
        result.push(arr[startIndex], arr[startIndex + 1], arr[startIndex + 2]);
    }

    // Map the indices to the symbol array
    symbolData = result.map(index => symbol[index]);
    return { symbolData, result };
}
//   function getRandomNearNumbers(arr, symbol) {
//     const result = [];
//     let symbolData = []
//     // console.log("arr.length",arr.length);
//     // Choose a random starting index
//     const startIndex = Math.floor(Math.random() * (arr.length - 1));
//     // Add the three consecutive numbers starting from the random index to the result
//     console.log("startIndex",startIndex);
//     if (startIndex >= arr.length - 1) {
//         // If the starting index is at or near the end of the array
//         result.push(arr[startIndex], arr[startIndex + 1], arr[0]);

//     } else if (startIndex >= arr.length - 2) {
//         console.log("arr", arr[0]);
//         result.push(arr[startIndex], arr[0], arr[0 + 1]);
//     }
//     else {
//         // Otherwise, add the three consecutive numbers
//         result.push(arr[startIndex], arr[startIndex + 1], arr[startIndex + 2]);
//     }

//     symbolData = result.map(index => symbol[index])
//     randomNumber.push(startIndex)
//     return { symbolData, result };
// }

function getSymobl(arr, symbol) {
    const result = [];
    let symbolData = []
    // Choose a random starting index
    // Add the three consecutive numbers starting from the random index to the result
    result.push(arr[0], arr[0 + 1], arr[0 + 2]);
    symbolData = result.map(index => symbol[index])
    return { symbolData, result };
}

function findMatchingAliments(winCombination, arrays, reel) {
    // console.log("winCombination", winCombination[0], arrays[1]);
    const initialSymbol = arrays[winCombination[0]][0];
    const secondSymbol = arrays[winCombination[1]][1];


    if (initialSymbol === 9 || secondSymbol === 9) {
        return;
    }

    let canWin = false;
    let doubleCount = 0;
    let detail = null;
    let targetSymbol = -1;

    if (initialSymbol === secondSymbol) {
        canWin = true;
    }


    doubleCount = checkDoubleStatus(winCombination, canWin, arrays);
    targetSymbol = arrays[winCombination[0]][0];

    if (doubleCount > 0) {
        canWin = true;
    }

    if (targetSymbol === 10 && canWin) {
        targetSymbol = extractTargetSymbol(winCombination, arrays);
    }
    // console.log("targetSymbol", targetSymbol);

    if (canWin) {
        console.log(targetSymbol, checkTargetSymbolOccurence(winCombination, targetSymbol, arrays), doubleCount,);
        return {
            targetSymbol: targetSymbol,
            targetSymbolOccurence: checkTargetSymbolOccurence(winCombination, targetSymbol, arrays),
            doubleCount: doubleCount,

        };
    }


}
function checkDoubleStatus(winCombination, canWin = false, reelMapping) {
    let doubleCount = 0;
    const initialSymbol = reelMapping[winCombination[0]][0];
    const secondSymbol = reelMapping[winCombination[1]][1];

    if (initialSymbol === 9 || secondSymbol === 9) {
        return 0;
    }

    if (!canWin && secondSymbol === 10) {
        canWin = true;
    }

    if (!canWin && initialSymbol !== 10) {
        return 0;
    }

    // console.log("reelMapping", reelMapping);
    if (initialSymbol !== 10) {
        // console.log("reelMapping", reelMapping);
        doubleCount = checkDoubleCount(winCombination, doubleCount, reelMapping);
    }

    if (initialSymbol === 10) {
        // Convert the initial symbol to the right one
        reelMapping[winCombination[0]][0] = reelMapping[winCombination[1]][1];
        doubleCount++;
        doubleCount = checkDoubleCount(winCombination, doubleCount, reelMapping);
    }

    return doubleCount;
}
function extractTargetSymbol(winCombination, reelMapping) {
    let targetSymbol = 1;
    let isSequence = true;

    for (let symbolIndex = 1; symbolIndex < winCombination.length; symbolIndex++) {
        if (reelMapping[winCombination[symbolIndex]][symbolIndex] !== targetSymbol) {
            targetSymbol = reelMapping[winCombination[symbolIndex]][symbolIndex];
            break;
        }
    }

    return targetSymbol;
}
function checkDoubleCount(winCombination, doubleCount, reelMapping) {
    // console.log("winCombination2122", reelMapping);
    for (let symbolIndex = 1; symbolIndex < winCombination.length; symbolIndex++) {
        const currentSymbol = reelMapping[winCombination[symbolIndex]][symbolIndex];
        const previousSymbol = reelMapping[winCombination[symbolIndex - 1]][symbolIndex - 1];

        if (currentSymbol === 10 || currentSymbol === previousSymbol) {
            if (currentSymbol === 10) {
                doubleCount++;
            }
        } else {
            break;
        }
    }

    return doubleCount;
}
function checkTargetSymbolOccurence(winCombination, targetSymbol, reelMapping) {
    let targetCount = 1;

    for (let symbolIndex = 1; symbolIndex < winCombination.length; symbolIndex++) {
        const currentSymbol = reelMapping[winCombination[symbolIndex]][symbolIndex];

        if (currentSymbol === targetSymbol || currentSymbol === 10) {
            targetCount++;
        } else {
            break;
        }
    }

    return targetCount;
}


const countArraysContainingValueWithIndices = (arr, value = 9) => {
    // console.log("Bonusarr", arr);
    const result = {
        count: 0,
        indices: [],
        array: []
    };

    arr.forEach((subArr, index) => {
        if (subArr.includes(value)) {
            result.count++;
            result.indices.push(index);

        }
    });
    result.array.push(arr)
    // console.log("result.count == 2",result.count == 2,result.count);
    if (result.count == 2) {
        bonusReelStuck = result
    }
    // console.log("bonus result", result);
    return result;
};
const countArraysContainingValueWithDouble = (arr, value = 10) => {
    const result = {
        count: 0,
        indices: [],
        array: []
    };

    arr.forEach((subArr, index) => {
        if (subArr.includes(value)) {
            result.count++;
            result.indices.push(index);

        }
    });
    result.array.push(arr)
    return result;
};
function getLengthExcludingValue(arr, valueToExclude) {
    let count = 0;
    for (let item of arr) {
        if (item === -1) {
            break; // Stop counting if -1 is encountered
        }
        if (item !== valueToExclude) {
            count++;
        }
    }
    return count;
}

async function get_customer_data(req, res) {
    try {
        const { limit = 10, page = 1, globlesearch = "" } = req.body;
        const query = {};

        if (globlesearch) {
            query.$or = [
                { name: { $regex: globlesearch, $options: "i" } },
                { email: { $regex: globlesearch, $options: "i" } },
                { phone: { $regex: globlesearch, $options: "i" } }
            ];
        }

        const customers = await customerModel
            .find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .exec();

        const total = await customerModel.countDocuments(query);

        res.status(200).json({ success: true, data: customers, total });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
}

