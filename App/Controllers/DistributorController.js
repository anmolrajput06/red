var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var helper = require('../../Helper/helper');
var dateformat = require('dateformat');
const mongoose = require('mongoose');
module.exports = {
    distributors: async function (req, res) {
        try {
            let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
            console.log(userDetails)
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                distributorsMangement: 'active',
                role: req.session.details.role,
                id: req.session.details.id
            };
            return res.render('distributor/distributor', data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    getDistributors: async function (req, res) {
        try {
            console.log("req.body", req.query);
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = { role: "distributor" }

            if (search != '') {
                query.userName = { $regex: '.*' + search + '.*' };
            }
            if (req.query.startdate != "" && req.query.enddate != '') {
                // Convert start and end dates to UTC midnight and end of the day
                const startdate = req.query.startdate;
                const [day1, month1, year1] = startdate.split('/');
                const startDate = new Date(year1, month1 - 1, day1);
                startDate.setHours(0, 0, 0, 0)
                let enddate = req.query.enddate
                const [day, month, year] = enddate.split('/');
                const endDate = new Date(year, month - 1, day);
                endDate.setHours(23, 59, 59, 999)
                console.log("startDate, endDate", startDate, endDate);

                // Use $expr, $gte, and $lte to query the date range
                query.createdAt = {
                    $gte: startDate,
                    $lte: endDate
                };

            }
            console.log("getDistributors query", query);
            let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);
            let dataCount = await Sys.App.Services.UserServices.getUserCount(query);
            console.log("data", data);

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

    addDistributor: async function (req, res) {
        try {

            let gameList = await Sys.App.Services.GameService.findGame({});
            // console.log(gameList);
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                distributorsMangement: 'active',
                role: req.session.details.role,
                gameList:gameList
            };
            return res.render('distributor/addDistributor', data);
        } catch (e) {
            console.log("Error", e);
        }
    },
    addPostDistributor: async function (req, res) {
        try {
            console.log("req.body", req.body);
            let bounceData = []
            let gameData = []
            
            for (let i = 0; i < 5; i++) {
                gameData.push({
                    "game": req.body["game" + [i]]
                })
            }
            console.log("gameData", gameData);
            if (req.body.mode == "sweepStakes" && req.body.bounceBack == "true") {
                bounceData = [{
                    minDeposit: 0,
                    maxDeposit: 19.99,
                    bounceBackUsd: req.body.bounce1
                }, {
                    minDeposit: 20,
                    maxDeposit: 49.99,
                    bounceBackUsd: req.body.bounce2
                }, {
                    minDeposit: 50,
                    maxDeposit: 99.99,
                    bounceBackUsd: req.body.bounce3
                }, {
                    minDeposit: 100,
                    bounceBackUsd: req.body.bounce4
                }]
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
            })
            var mailOptions = {
                to_email: req.body.email,
                subject: 'Planet Sweep Slot : Your Account Credentials',
                message: '<p>Dear ' + req.body.name + ',<br><br>We hope this email finds you well. As requested, here are your account credentials for Planet Sweep Slot.<br><br>Username: ' + req.body.username + ' / ' + req.body.email + '<br>Password: ' + req.body.password + '<br><br>For security reasons, we recommend changing your password immediately upon logging in. If you have any difficulties or concerns, please do not hesitate to contact our support team at [support@gmail.com].<br><br>Thank you for choosing Planet Sweep Slot.<br><br>Best regards,<br>Planet Sweep Slot.</p>'
            };
            await helper.sendMail(mailOptions);

            req.flash('success', 'Your user created successfully.');
            return res.redirect('/distributors');
        } catch (e) {
            console.log("Error", e);
        }
    },
    changeDistributorStatus: async function (req, res) {
        try {
            console.log("req.body", req.body);
            let distributor = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.body.id })
            let status
            if (distributor) {
                if (distributor.status == "active") {
                    status = "inactive"
                } else {
                    status = "active"
                }
                await Sys.App.Services.UserServices.updateUserData({ _id: req.body.id }, { status: status })
                return res.send("success")
            }
        } catch (e) {
            console.log("Error", e);
        }
    },
    changeCustomerStatus: async function (req, res) {
        try {
            console.log("req.body", req.body);
            let customer = await Sys.App.Services.UserServices.getSingleCustomerData({ _id: req.body.id })
            let status
            console.log("customer=>>>>>>>>>>>>>>>>",customer);
            if (customer) {
                if (customer.status == "active") {
                    status = "inactive"
                } else {
                    status = "active"
                }
                await Sys.App.Services.UserServices.updateCustomerData({ _id: req.body.id }, { status: status })
                return res.send("success")
            }
        } catch (e) {
            console.log("Error", e);
        }
    },
    editDistributor: async function (req, res) {
        try {
            console.log("req.param.id", req.params);
            let distributor = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id })
            let gameList = await Sys.App.Services.GameService.findGame({});
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                distributorsMangement: 'active',
                role: req.session.details.role,
                distributor: distributor,
                gameList:gameList
            };
            console.log("distributor", distributor);
            return res.render('distributor/addDistributor', data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    editPostDistributor: async function (req, res) {
        try {
            console.log("req.body", req.body);
            let bounceData = []
            let gameData = []
            let password
            for (let i = 0; i < 5; i++) {
                gameData.push({
                    "game": req.body["game" + [i]]
                })
            }
            console.log("gameData", gameData);
            if (isBcryptHash(req.body.password)) {
                password = req.body.password
            } else {
                password = bcrypt.hashSync(req.body.password, 10)
            }
            if (req.body.mode == "sweepStakes" && req.body.bounceBack == "true") {
                bounceData = [{
                    minDeposit: 0,
                    maxDeposit: 19.99,
                    bounceBackUsd: req.body.bounce1
                }, {
                    minDeposit: 20,
                    maxDeposit: 49.99,
                    bounceBackUsd: req.body.bounce2
                }, {
                    minDeposit: 50,
                    maxDeposit: 99.99,
                    bounceBackUsd: req.body.bounce3
                }, {
                    minDeposit: 100,
                    bounceBackUsd: req.body.bounce4
                }]
            }
            console.log("bounceData", bounceData, gameData);
            await Sys.App.Services.UserServices.updateUserData({ _id: req.params.id }, {
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
                percentage: req.body.percentage
            })
            req.flash('success', 'Your user updated successfully.');
            return res.redirect('/distributors');
        } catch (e) {
            console.log("Error", e);
        }
    },

    validateEmail: async function (req, res) {
        try {
            console.log("validateEmail", req.body.email);
            let distributor = await Sys.App.Services.UserServices.getSingleUserData({ email: req.body.email })
            console.log("distributor", distributor);
            if (req.body.distributorId != '' && distributor) {
                if (distributor._id == req.body.distributorId) {
                    return res.send("error")
                } else {
                    return res.send("success")
                }
            } else {
                if (distributor) {
                    return res.send("success")
                } else {
                    return res.send("error")
                }
            }
        } catch (e) {
            console.log("distributorController validateEmail Error", e);
            return new Error('distributorController validateEmail Error', e);
        }
    },

    validateUserName: async function (req, res) {
        try {
            console.log("validateUsername data", req.body);
            let distributor = await Sys.App.Services.UserServices.getSingleUserData({ userName: req.body.username })
            console.log("distributor", distributor);
            if (req.body.distributorId != '' && distributor) {
                if (distributor._id == req.body.distributorId) {
                    return res.send("error")
                } else {
                    return res.send("success")
                }
            } else {
                if (distributor) {
                    return res.send("success")
                } else {
                    return res.send("error")
                }
            }
        } catch (e) {
            console.log("distributorController validateUsername Error", e);
            return new Error('distributorController validateUsername Error', e);
        }
    },
    viewSubDistributor: async function (req, res) {
        try {
            console.log("validateUsername data", typeof req.params);
            let distributor = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id });
            console.log("distributor", distributor);
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                distributorsMangement: 'active',
                role: req.session.details.role,
                id: distributor._id,
                distributor: distributor
            };
            console.log("data", data.id);
            return res.render('distributor/users', data);
        } catch (e) {
            console.log("distributorController viewSubDistributor Error", e);
            return new Error('distributorController viewSubDistributor Error', e);
        }
    },
    subDistributorsEdit: async function (req, res) {
        try {
            console.log("req.param.id", req.params);
            let subDistributor = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id })
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                distributorsMangement: 'active',
                role: req.session.details.role,
                user: subDistributor
            };
            return res.render('user/editSubdistributor', data);
        } catch (e) {
            console.log("distributorController subDistributorsEdit Error", e);
            return new Error('distributorController subDistributorsEdit Error', e);
        }
    },

    shopsEdit: async function (req, res) {
        try {
            console.log("req.param.id", req.params);
            let subDistributor = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id })
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                distributorsMangement: 'active',
                role: req.session.details.role,
                user: subDistributor
            };
            return res.render('user/addUser', data);
        } catch (e) {
            console.log("distributorController subDistributorsEdit Error", e);
            return new Error('distributorController subDistributorsEdit Error', e);
        }
    },
    shopEdit: async function (req, res) {
        try {
            console.log("req.param.id", req.params);
            let subDistributor = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id })
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                distributorsMangement: 'active',
                role: req.session.details.role,
                user: subDistributor
            };
            return res.render('user/addShops', data);
        } catch (e) {
            console.log("distributorController subDistributorsEdit Error", e);
            return new Error('distributorController subDistributorsEdit Error', e);
        }
    },
    getUsers: async function (req, res) {
        try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = { role: req.query.type, userId: req.query.userId }

            if (search != '') {
                query.userName = { $regex: '.*' + search + '.*' };
            }
            if (req.query.startdate != "" && req.query.enddate != '') {
                const startdate = req.query.startdate;
                const [day1, month1, year1] = startdate.split('/');
                const startDate = new Date(year1, month1 - 1, day1);
                startDate.setHours(0, 0, 0, 0)
                let enddate = req.query.enddate
                const [day, month, year] = enddate.split('/');
                const endDate = new Date(year, month - 1, day);
                endDate.setHours(23, 59, 59, 999)
                console.log("startDate, endDate", startDate, endDate);

                // Use $expr, $gte, and $lte to query the date range
                query.createdAt = {
                    $gte: startDate,
                    $lte: endDate
                };
            }
            let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);
            let dataCount = await Sys.App.Services.UserServices.getUserCount(query);
            console.log("dataCount", dataCount);

            var obj = {
                'draw': req.query.draw,
                'recordsTotal': dataCount,
                'recordsFiltered': dataCount,
                'data': data
            };
            res.send(obj);
        } catch (e) {
            console.log("distributorController getSubDistributor Error", e);
            return new Error('distributorController getSubDistributor Error', e);
        }
    },

    getSubDistributors: async function (req, res) {
        try {
            console.log("req.body", req.query);
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = { role: "subDistributor", userId: req.query.userId }

            if (search != '') {
                query.userName = { $regex: '.*' + search + '.*' };
            }
            if (req.query.startdate != "" && req.query.enddate != '') {
                const startdate = req.query.startdate;
                const [day1, month1, year1] = startdate.split('/');
                const startDate = new Date(year1, month1 - 1, day1);
                startDate.setHours(0, 0, 0, 0)
                let enddate = req.query.enddate
                const [day, month, year] = enddate.split('/');
                const endDate = new Date(year, month - 1, day);
                endDate.setHours(23, 59, 59, 999)
                console.log("startDate, endDate", startDate, endDate);

                // Use $expr, $gte, and $lte to query the date range
                query.createdAt = {
                    $gte: startDate,
                    $lte: endDate
                };
            }
            console.log("getDistributors query", query);
            let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);
            let dataCount = await Sys.App.Services.UserServices.getUserCount(query);
            console.log("dataCount", dataCount);

            var obj = {
                'draw': req.query.draw,
                'recordsTotal': dataCount,
                'recordsFiltered': dataCount,
                'data': data
            };
            res.send(obj);
        } catch (e) {
            console.log("error", e);
        }
    },
    getShops: async function (req, res) {
        try {
            console.log("req.body", req.query);
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = { role: "shop", userId: req.query.userId }

            if (search != '') {
                query.userName = { $regex: '.*' + search + '.*' };
            }
            if (req.query.startdate != "" && req.query.enddate != '') {
                const startdate = req.query.startdate;
                const [day1, month1, year1] = startdate.split('/');
                const startDate = new Date(year1, month1 - 1, day1);
                startDate.setHours(0, 0, 0, 0)
                let enddate = req.query.enddate
                const [day, month, year] = enddate.split('/');
                const endDate = new Date(year, month - 1, day);
                endDate.setHours(23, 59, 59, 999)
                console.log("startDate, endDate", startDate, endDate);

                // Use $expr, $gte, and $lte to query the date range
                query.createdAt = {
                    $gte: startDate,
                    $lte: endDate
                };
            }
            console.log("getDistributors query", query);
            let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);
            let dataCount = await Sys.App.Services.UserServices.getUserCount(query);
            console.log("dataCount", dataCount);

            var obj = {
                'draw': req.query.draw,
                'recordsTotal': dataCount,
                'recordsFiltered': dataCount,
                'data': data
            };
            res.send(obj);
        } catch (e) {
            console.log("error", e);
        }
    },
    getSubdistributorsShops: async function (req, res) {
        try {
            console.log("getSubdistributorsShops", req.params);
            let subDistributorsDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id });
            let distributor = await Sys.App.Services.UserServices.getSingleUserData({ _id: subDistributorsDetails.userId })
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                distributorsMangement: 'active',
                role: req.session.details.role,
                subDistributorsDetails: subDistributorsDetails,
                distributor: distributor
            };
            return res.render('distributor/subDistributorShop', data);
        } catch (e) {
            console.log("error", e);
        }
    },
    getSubdistributorShops: async function (req, res) {
        try {
            console.log("getSubdistributorsShops", req.params);
            let subDistributorsDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id });
            let distributor = await Sys.App.Services.UserServices.getSingleUserData({ _id: subDistributorsDetails.userId })
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                userManagement: 'active',
                role: req.session.details.role,
                subDistributorsDetails: subDistributorsDetails,
                distributor: distributor
            };
            return res.render('distributor/subDistributorShop', data);
        } catch (e) {
            console.log("error", e);
        }
    },
    getSubdistributorsShopsDetails: async function (req, res) {
        try {
            console.log("req.body", req.query);
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = { role: "shop", userId: req.query.userId }

            if (search != '') {
                query.userName = { $regex: '.*' + search + '.*' };
            }
            if (req.query.startdate != "" && req.query.enddate != '') {
                const startdate = req.query.startdate;
                const [day1, month1, year1] = startdate.split('/');
                const startDate = new Date(year1, month1 - 1, day1);
                startDate.setHours(0, 0, 0, 0)
                let enddate = req.query.enddate
                const [day, month, year] = enddate.split('/');
                const endDate = new Date(year, month - 1, day);
                endDate.setHours(23, 59, 59, 999)
                console.log("startDate, endDate", startDate, endDate);

                // Use $expr, $gte, and $lte to query the date range
                query.createdAt = {
                    $gte: startDate,
                    $lte: endDate
                };
            }
            console.log("getDistributors query", query);
            let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);
            let dataCount = await Sys.App.Services.UserServices.getUserCount(query);
            console.log("dataCount", dataCount);

            var obj = {
                'draw': req.query.draw,
                'recordsTotal': dataCount,
                'recordsFiltered': dataCount,
                'data': data
            };
            res.send(obj);
        } catch (e) {
            console.log("error", e);
        }
    },
    getShopsCashier: async function (req, res) {
        try {
            console.log("getSubdistributorsShops", req.params);
            let shopDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id });
            let subDistributor = await Sys.App.Services.UserServices.getSingleUserData({ _id: shopDetails.userId })
            let distributor = await Sys.App.Services.UserServices.getSingleUserData({ _id: subDistributor.userId })
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                role: req.session.details.role,
                shopDetails: shopDetails,
                subDistributor: subDistributor,
                distributor: distributor
            };
            if (req.session.details.role == "distributor") {
                data["userManagement"] = "active"
            } else if (req.session.details.role == "subDistributor") {
                data["shopMangement"] = "active"
            } else {
                data["distributorsMangement"] = "active"
            }
            return res.render('distributor/shop', data);
        } catch (e) {
            console.log("error", e);
        }
    },
    getCashier: async function (req, res) {
        try {
            console.log("req.body", req.query);
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;
            let query = {  userId: mongoose.Types.ObjectId(req.query.userId) }
            if (search != '') {
                query.userName = { $regex: '.*' + search + '.*' };
            }
            if (req.query.startdate != "" && req.query.enddate != '') {
                const startdate = req.query.startdate;
                const [day1, month1, year1] = startdate.split('/');
                const startDate = new Date(year1, month1 - 1, day1);
                startDate.setHours(0, 0, 0, 0);
                let enddate = req.query.enddate;
                const [day, month, year] = enddate.split('/');
                const endDate = new Date(year, month - 1, day);
                endDate.setHours(23, 59, 59, 999);
                console.log("startDate, endDate", startDate, endDate);

                // Use $expr, $gte, and $lte to query the date range
                query.createdAt = {
                    $gte: startDate,
                    $lte: endDate
                };
            }
            console.log("getDistributors query", query);
            let data = await Sys.App.Services.UserServices.getCashierDatatable(query, length, start);
            let dataCount = await Sys.App.Services.UserServices.getUserCount(query);
            console.log("data===============================================>", data);
            var obj = {
                'draw': req.query.draw,
                'recordsTotal': dataCount,
                'recordsFiltered': dataCount,
                'data': data
            };
            res.send(obj);
        } catch (e) {
            console.log("error", e);
        }
    },
    
    setting: async function (req, res) {
        try {
            let settings = await Sys.App.Services.UserServices.getSettings({})
            console.log("settings", settings);
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                role: req.session.details.role,
                settings: settings,
                setting: "active"
            };
            return res.render('settings/settings', data);
        } catch (e) {
            console.log("error", e);
        }
    },
    addSetting: async function (req, res) {
        try {
            // let settings = await Sys.App.Services.UserServices.getSettings({})
            await Sys.App.Services.UserServices.createSetting({ chips: req.body.chips })
            req.flash('success', 'Setting data updated successfully.')
            return res.redirect('/settings')
        } catch (e) {
            console.log("error", e);
        }
    },

    updateSetting: async function (req, res) {
        try {
            console.log("data", req.params, req.body);
            // let settings = await Sys.App.Services.UserServices.getSettings({})
            await Sys.App.Services.UserServices.updateSetting({ _id: req.params.id }, { chips: req.body.chips })
            req.flash('success', 'Setting data updated successfully.')
            return res.redirect('/settings')
        } catch (e) {
            console.log("error", e);
        }
    },
    editSetting: async function (req, res) {
        try {
            // let settings = await Sys.App.Services.UserServices.getSettings({})
            await Sys.App.Services.UserServices.updateSetting({ chips: req.body.chips })
            return res.redirect('/settings')
        } catch (e) {
            console.log("error", e);
        }
    },

    betReport: async function (req, res) {
        try {
          var data = {
            App: Sys.Config.App.details,
            error: req.flash("error"),
            success: req.flash("success"),
            shopBetReport: "active",
            report: "active",
            role: req.session.details.role,
          };
          return res.render("report/distributerBetReports", data);
        } catch (e) {
          console.log("error", e);
        }
      },
    
      getBetReportData: async function (req, res) {
        try {
          let start = parseInt(req.query.start);
          let length = parseInt(req.query.length);
          let search = req.query.search;
          let query = {
            role: "distributor",
          };
          let date={};
    
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
          console.log("distributer========================>");
          let data =
            await Sys.App.Services.CustomerServices.getDistributerBetReport(
              query,
              length,
              start,
              date
            );
          console.log("data=>>>>>", data);
          let dataCount =
            await Sys.App.Services.CustomerServices.getDistributerBetReportCount(
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

      distributorProfile:async function(req,res){
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
        // res.send(`<pre>${userData[0]}</pre>`);
        res.render("distributor/profile",data)
      }

    // addUser: async function(req, res) {
    //     try {
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             userActive: 'active'
    //         };
    //         return res.render('user/add', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addUserPostData: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.UserServices.getUserData({ email: req.body.email });
    //         let username = await Sys.App.Services.UserServices.getUserData({ name: req.body.username });
    //         if(username.length>0){
    //             req.flash('error', 'User Already Present');
    //             res.redirect('/user');
    //             return; 
    //         }
    //         if (player && player.length > 0) {
    //             req.flash('error', 'User Already Present');
    //             res.redirect('/user');
    //             return;
    //         } else {
    //             await Sys.App.Services.UserServices.insertUserData({
    //                 name: req.body.username,
    //                 email: req.body.email,
    //                 role: req.body.role,
    //                 status: req.body.status,
    //                 password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
    //             })
    //             req.flash('success', 'User create successfully');
    //             res.redirect('/user');
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // getUserDelete: async function(req, res) {
    //     console.log("call", req.body);
    //     try {
    //         let player = await Sys.App.Services.UserServices.getUserData({ _id: req.body.id });
    //         console.log(player);
    //         if (player || player.length > 0) {
    //             await Sys.App.Services.UserServices.deleteUser(req.body.id)
    //             await Sys.App.Services.UserServices.deleteRole(player[0].name)
    //             return res.send("success");
    //         } else {
    //             return res.send("error");
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editUser: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id });
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:user.role})
    //         console.log(commissionRange);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             user: user,
    //             userActive: 'active',
    //             commissionRange:commissionRange
    //         };
    //         return res.render('user/add', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editUserPostData: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.UserServices.getUserData({ _id: req.params.id });
    //         let username = await Sys.App.Services.UserServices.getUserData({ name: req.body.username });
    //         console.log("username", username);
    //         if ( username.length == 0 ||req.params.id == username[0]._id) {
    //             if (player && player.length > 0) {
    //                 await Sys.App.Services.UserServices.updateUserData({
    //                     _id: req.params.id
    //                 }, {
    //                     name: req.body.username,
    //                     status: req.body.status,
    //                     userId: req.session.details.id,
    //                     referralCode: req.body.referralCode,
    //                     commission: req.body.commission,
    //                     mobile: req.body.mobile,
    //                 })
    //                 req.session.details.commission = req.body.commission
    //                 req.flash('success', 'User update successfully');
    //                 res.redirect('/user');

    //             } else {
    //                 req.flash('error', 'No User found');
    //                 res.redirect('/');
    //                 return;
    //             }
    //         }
    //         else {
    //             req.flash('error', 'User Already Present');
    //             res.redirect('/user');
    //             return;
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editSiteOwner: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id });
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:user.role})
    //         console.log(commissionRange);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             user: user,
    //             Owner: 'active',
    //             commissionRange:commissionRange
    //         };
    //         return res.render('user/addSiteOwner', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editSiteOwnerPostData: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.UserServices.getUserData({ _id: req.params.id });
    //         let userName = await Sys.App.Services.UserServices.getUserData({name:req.body.username})
    //         let siteOwnerDownLine = await Sys.App.Services.UserServices.getUserData({userId:req.params.id})
    //         let masterDownLine = []
    //         var grandMasterDownLine = [] 
    //         if (userName.length == 0 || req.params.id == userName[0]._id ) {
    //             if (player && player.length > 0) {
    //                 if(siteOwnerDownLine.length){
    //                     for (let siteOwner = 0; siteOwner < siteOwnerDownLine.length; siteOwner++) {
    //                         let grandMasterTotalCommission = siteOwnerDownLine[siteOwner].totalCommission * req.body.commission / 100
    //                         await Sys.App.Services.UserServices.updateUserData({
    //                             _id: siteOwnerDownLine[siteOwner]._id
    //                         }, {
    //                             commission: grandMasterTotalCommission,
    //                         })
    //                         console.log("1111111111111111111111111111",grandMasterDownLine);
    //                         grandMasterDownLine=await Sys.App.Services.UserServices.getUserData({userId:siteOwnerDownLine[siteOwner]._id})
    //                             for (let grandMaster = 0; grandMaster < grandMasterDownLine.length; grandMaster++) {
    //                                 let masterTotalCommission
    //                                 if (JSON.stringify(siteOwnerDownLine[siteOwner]._id) == JSON.stringify(grandMasterDownLine[grandMaster].userId)) {
    //                                     console.log("grandMasterTotalCommission",grandMasterTotalCommission);
    //                                     console.log("grandMasterDownLine[grandMaster].totalCommission", grandMasterDownLine[grandMaster].totalCommission);
    //                                     masterTotalCommission = grandMasterDownLine[grandMaster].totalCommission * grandMasterTotalCommission / 100
    //                                     await Sys.App.Services.UserServices.updateUserData({
    //                                         _id: grandMasterDownLine[grandMaster]._id
    //                                     }, {
    //                                         commission: masterTotalCommission,
    //                                     })
    //                                 }
    //                                 masterDownLine=await Sys.App.Services.UserServices.getUserData({userId:grandMasterDownLine[grandMaster]._id});
    //                                 if(masterDownLine.length){
    //                                     for (let master = 0; master < masterDownLine.length; master++) {
    //                                         if (JSON.stringify(grandMasterDownLine[grandMaster]._id) == JSON.stringify(masterDownLine[master].userId)) {
    //                                             let agentTotalCommission = masterDownLine[master].totalCommission * masterTotalCommission / 100
    //                                             await Sys.App.Services.UserServices.updateUserData({
    //                                                 _id: masterDownLine[master]._id
    //                                             }, {
    //                                                 commission: agentTotalCommission,
    //                                             })
    //                                         }
    //                                     }
    //                                 }
    //                             }

    //                     }
    //                 }
    //                 let siteOwnerTotalCommission = req.body.commission * 100 / 100
    //                 await Sys.App.Services.UserServices.updateUserData({
    //                     _id: req.params.id
    //                 }, {
    //                     name: req.body.username,
    //                     status: req.body.status,
    //                     userId: req.session.details.id,
    //                     referralCode: req.body.referralCode,
    //                     totalCommission: req.body.commission,
    //                     commission: siteOwnerTotalCommission,
    //                     mobile: req.body.mobile,
    //                 })
    //                 req.flash('success', 'User update successfully');
    //                 res.redirect('/mySiteOwner');

    //             } else {
    //                 req.flash('error', 'No User found');
    //                 res.redirect('/');
    //                 return;
    //             }
    //     }
    //     else{
    //         req.flash('error', 'User already present');
    //         res.redirect('/mySiteOwner');
    //         return;
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editSiteOwnerStatus: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.UserServices.getUserData({ _id: req.body.id });
    //         console.log(player);
    //         var siteOwner
    //         if (player[0].status == "active") {
    //             siteOwner = "inactive"
    //         } else {
    //             siteOwner = "active"
    //         }
    //         if (player || player.length > 0) {
    //             await Sys.App.Services.UserServices.updateUserData({ _id: req.body.id }, { status: siteOwner })
    //             return res.send("success");
    //         } else {
    //             return res.send("error");
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // grandMasterStatus: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.UserServices.getUserData({ _id: req.body.id });
    //         console.log(player);
    //         var siteOwner
    //         if (player[0].status == "active") {
    //             siteOwner = "block"

    //         } else {
    //             siteOwner = "active"
    //         }
    //         console.log(siteOwner);
    //         if (player || player.length > 0) {
    //             await Sys.App.Services.UserServices.updateUserData({ _id: req.body.id }, { status: siteOwner })
    //             return res.send("success");
    //         } else {
    //             return res.send("error");
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // userStatus: async function(req, res) {
    //     try {
    //         console.log("maulik", req.body);
    //         let player = await Sys.App.Services.UserServices.getUserData({ _id: req.body.id });
    //         console.log(player);
    //         var siteOwner
    //         if (player[0].status == "active") {
    //             siteOwner = "inactive"

    //         } else {
    //             siteOwner = "active"
    //         }
    //         console.log(siteOwner);
    //         if (player || player.length > 0) {
    //             await Sys.App.Services.UserServices.updateUserData({ _id: req.body.id }, { status: siteOwner })
    //             return res.send("success");
    //         } else {
    //             return res.send("error");
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },

    // mySiteOwner: async function(req, res) {
    //     try {
    //         let roleData = await Sys.App.Services.UserServices.getRole({ name: req.session.details.name })
    //         console.log("roleData", roleData);
    //         var roleApprove

    //         console.log('11111');
    //         if (roleData == null) {
    //             console.log('22222');

    //             roleApprove = ""
    //         } else {
    //             console.log('33333');

    //             roleApprove = roleData.permission['My Site Owner']
    //         }
    //         let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             Owner: 'active',
    //             user: "active",
    //             roleData: roleApprove
    //         };
    //         req.session.details.chips = parseFloat(userDetails.chips).toFixed(2)
    //         return res.render('user/siteOwner', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // getSiteOwner: async function(req, res) {
    //     try {
    //         console.log("yessss");
    //         let start = parseInt(req.query.start);
    //         let length = parseInt(req.query.length);
    //         let search = req.query.search.value;
    //         let status = req.query.status
    //         const ObjectId = mongoose.Types.ObjectId;
    //         let superAdmin = await Sys.App.Services.UserServices.getOneByData({ role: 'admin' })
    //         let query
    //         if (req.session.details.role == "sub-admin") {
    //             query = { userId: ObjectId(superAdmin._id), role: 'site-owner' }
    //         }
    //         else {

    //             query = { userId: req.session.details.id, role: 'site-owner' }
    //         }
    //         console.log(query);
    //         if (status) {
    //             if (req.session.details.role == 'sub-admin') {
    //                 query = { userId: ObjectId(superAdmin._id), role: 'site-owner', status: status }
    //             }
    //             else {
    //                 query = { userId: req.session.details.id, role: 'site-owner', status: status }
    //             }
    //         }
    //         if (search != '') {
    //             let capital = search;
    //             if (req.session.details.role == 'sub-admin') {
    //                 if(status == ""){
    //                 query = { name: { $regex: '.*' + search + '.*' }, userId: superAdmin._id, role: 'site-owner' };
    //                 }
    //                 else{
    //                     query = { name: { $regex: '.*' + search + '.*' }, userId: superAdmin._id, role: 'site-owner',status:status };
    //                 }
    //             }
    //             else {
    //                 if(status == ""){
    //                 query = { name: { $regex: '.*' + search + '.*' }, userId: req.session.details.id, role: 'site-owner' };
    //                 }
    //                 else{
    //                     query = { name: { $regex: '.*' + search + '.*' }, userId: superAdmin._id, role: 'site-owner',status:status };
    //                 }
    //             }
    //         }

    //         let playersC = await Sys.App.Services.UserServices.getUserData(query);
    //         let playersCount = playersC.length;
    //         let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);
    //         console.log("data", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'recordsTotal': playersCount,
    //             'recordsFiltered': playersCount,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addSiteOwner: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id});
    //         let referralCodeGenerator = require('referral-code-generator')
    //         let code = referralCodeGenerator.alphaNumeric('uppercase', 2, 2)
    //         console.log("referralCodeGenerator", referralCodeGenerator.alphaNumeric('uppercase', 2, 2));
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:'site-owner'})
    //         console.log(commissionRange);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             userActive: 'active',
    //             referral: code,
    //             commissionRange:commissionRange,
    //             userData:user[0].commission
    //         };
    //         return res.render('user/addSiteOwner', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addSiteOwnerPostData: async function(req, res) {
    //     try {
    //         console.log("route", req.body);
    //         let player = await Sys.App.Services.UserServices.getUserData({ email: req.body.email});
    //         let userNameData =   await Sys.App.Services.UserServices.getUserData({name:req.body.username })
    //         console.log("player",player);
    //         if(userNameData && userNameData.length > 0){
    //             req.flash('error', 'User Already Present');
    //             res.redirect('/mySiteOwner');
    //             return;
    //         }
    //         if (player && player.length > 0) {
    //             req.flash('error', 'User Already Present');
    //             res.redirect('/mySiteOwner');
    //             return;
    //         } else {
    //             let siteOwnerCommissionData = req.body.commission * 100 / 100
    //             let player = await Sys.App.Services.UserServices.getUserCount({ referralCode: req.body.referralCode });
    //             if (player) {
    //                 req.flash('error', 'Referral Code Already Present');
    //                 res.redirect('/mySiteOwner');
    //                 return;
    //             }
    //             let siteOwnerTotalCommission  = 
    //             await Sys.App.Services.UserServices.insertUserData({
    //                 name: req.body.username,
    //                 email: req.body.email,
    //                 status: req.body.status,
    //                 password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
    //                 role: 'site-owner',
    //                 userId: req.session.details.id,
    //                 referralCode: req.body.referralCode,
    //                 totalCommission:req.body.commission,
    //                 commission: siteOwnerCommissionData,
    //                 mobile: req.body.mobile,
    //             })
    //             req.flash('success', 'User create successfully');
    //             res.redirect('/mySiteOwner');
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addDeductChips: async function(req, res) {
    //     try {
    //         let operation = req.body.chipsValue;
    //         let chips = req.body.chips;
    //         chips = Number(chips);
    //         if(chips <= 0){
    //             req.flash('error', 'Please enter valid chips.');
    //             res.redirect('/user');
    //         }
    //         else{
    //         let chipNote = req.body.chipsNote
    //         let User = await Sys.App.Services.UserServices.getOneByData({ _id: req.body.userId })
    //         if (User) {
    //             if (operation == "Add") {
    //                 let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                 if (userDetails.chips >= chips) {
    //                     let traNumber = +new Date()
    //                     console.log(Number(userDetails.chips));
    //                     console.log(chips);
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: -chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User._id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: userDetails.role,
    //                         providerId: User.id,
    //                         providerRole: User.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + User.username,
    //                         remark: 'Transaction To ' + User.username,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(userDetails.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + userDetails.email,
    //                         remark: 'Received From ' + userDetails.email,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(User.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:userDetails.name,
    //                         to:User.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"credit",
    //                         transactionId:'CR-' + traNumber
    //                     })
    //                     req.flash('success', 'Chips Added Successfully')
    //                     res.redirect('/user');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient admin chips.');
    //                     res.redirect('/user');
    //                     return;
    //                 }
    //             } else if (operation == 'Deduct') {
    //                 if (User.chips >= chips) {
    //                     let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User.id }, { $inc: { chips: -chips } });
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: User.role,
    //                         providerId: User.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + User.username,
    //                         remark: 'Received From ' + User.username,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(userDetails.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + userDetails.email,
    //                         remark: 'Transaction To ' + userDetails.email,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(User.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         category: 'debit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:User.name,
    //                         to:userDetails.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"debit",
    //                         transactionId:'DE-' + traNumber
    //                     })
    //                     req.flash('success', 'Chips Deduct Successfully')
    //                     res.redirect('/user');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient User chips.');
    //                     res.redirect('/user');
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addDeductChipsSiteOwner: async function(req, res) {
    //     try {
    //         console.log("maulik call");
    //         let operation = req.body.chipsValue;
    //         let chips = req.body.chips;
    //         chips = Number(chips);
    //         if (chips <= 0){
    //             req.flash('error', 'Please enter valid chips.');
    //             res.redirect('/mySiteOwner');
    //         }
    //         else{
    //         let chipNote = req.body.chipsNote
    //         console.log(req.body.userId)
    //         let User = await Sys.App.Services.UserServices.getOneByData({ _id: req.body.userId })
    //         if (User) {
    //             if (operation == "Add") {
    //                 let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                 if (userDetails.chips >= chips) {
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: -chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User._id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: userDetails.role,
    //                         providerId: User.id,
    //                         providerRole: User.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + User.username,
    //                         remark: 'Transaction To ' + User.username,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(userDetails.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + userDetails.email,
    //                         remark: 'Received From ' + userDetails.email,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(User.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     console.log("userDetails.name",userDetails.name);
    //                     console.log("User.name",User.name);
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:userDetails.name,
    //                         to:User.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"credit",
    //                         transactionId:'CR-' + traNumber
    //                     })
    //                     req.session.details.chips = parseFloat(userDetails.chips).toFixed(2)
    //                     req.flash('success', 'Chips Added Successfully')
    //                     res.redirect('/mySiteOwner');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient admin chips.');
    //                     res.redirect('/mySiteOwner');
    //                     return;
    //                 }
    //             } else if (operation == 'Deduct') {
    //                 if (User.chips >= chips) {
    //                     let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User.id }, { $inc: { chips: -chips } });
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: User.role,
    //                         providerId: User.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + User.username,
    //                         remark: 'Received From ' + User.username,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(userDetails.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + userDetails.email,
    //                         remark: 'Transaction To ' + userDetails.email,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(User.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         category: 'debit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     console.log("userDetails.name",userDetails.name);
    //                     console.log("User.name",User.name);
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:User.name,
    //                         to:userDetails.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"debit",
    //                         transactionId:'DE-' + traNumber
    //                     })
    //                     req.session.details.chips = parseFloat(userDetails.chips).toFixed(2)
    //                     req.flash('success', 'Chips Deduct Successfully')
    //                     res.redirect('/mySiteOwner');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient User chips.');
    //                     res.redirect('/mySiteOwner');
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addDeductChipsSubAdmin: async function(req, res) {
    //     try {
    //         console.log("maulik call");
    //         let operation = req.body.chipsValue;
    //         let chips = req.body.chips;
    //         chips = Number(chips);
    //         if (chips <= 0){
    //             req.flash('error', 'Please enter valid chips.');
    //             res.redirect('/subAdmin');
    //         }else{
    //         let chipNote = req.body.chipsNote
    //         console.log(req.body.userId)
    //         let User = await Sys.App.Services.UserServices.getOneByData({ _id: req.body.userId })
    //         if (User) {
    //             if (operation == "Add") {
    //                 let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                 if (userDetails.chips >= chips) {
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: -chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User._id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: userDetails.role,
    //                         providerId: User.id,
    //                         providerRole: User.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + User.username,
    //                         remark: 'Transaction To ' + User.username,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(userDetails.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + userDetails.email,
    //                         remark: 'Received From ' + userDetails.email,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(User.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     console.log("userDetails.name",userDetails.name);
    //                     console.log("User.name",User.name);
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:userDetails.name,
    //                         to:User.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"credit",
    //                         transactionId:'CR-' + traNumber
    //                     })
    //                     req.session.details.chips = parseFloat(userDetails.chips).toFixed(2)
    //                     req.flash('success', 'Chips Added Successfully')
    //                     res.redirect('/subAdmin');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient admin chips.');
    //                     res.redirect('/subAdmin');
    //                     return;
    //                 }
    //             } else if (operation == 'Deduct') {
    //                 if (User.chips >= chips) {
    //                     let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User.id }, { $inc: { chips: -chips } });
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: User.role,
    //                         providerId: User.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + User.username,
    //                         remark: 'Received From ' + User.username,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(userDetails.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + userDetails.email,
    //                         remark: 'Transaction To ' + userDetails.email,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(User.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         category: 'debit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     console.log("userDetails.name",userDetails.name);
    //                     console.log("User.name",User.name);
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:User.name,
    //                         to:userDetails.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"debit",
    //                         transactionId:'DE-' + traNumber
    //                     })
    //                     req.session.details.chips = parseFloat(userDetails.chips).toFixed(2)
    //                     req.flash('success', 'Chips Deduct Successfully')
    //                     res.redirect('/subAdmin');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient User chips.');
    //                     res.redirect('/subAdmin');
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // grandMasterPlayerList: async function(req, res) {
    //     try {
    //         console.log(req.params.id);
    //         let grandMasterData = await Sys.App.Services.UserServices.getUserDatatable({ _id: req.params.id })
    //         let grandMaster = await Sys.App.Services.UserServices.getUserDatatable({ _id: grandMasterData[0].userId })
    //         console.log(grandMasterData);
    //         req.session.details.chips = parseFloat(grandMaster[0].chips).toFixed(2)
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             grandMaster: 'active',
    //             Owner: 'active',
    //             user: "active",
    //             id: req.params.id,
    //             name: grandMasterData[0].name
    //         };
    //         return res.render('user/grandMasterPlayerList', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // grandMasterPlayerListGet: async function(req, res) {
    //     try {

    //         console.log("call", typeof(req.body.id));
    //         let start = parseInt(req.body.start);
    //         let search = req.body.search.value;
    //         const ObjectId = mongoose.Types.ObjectId;
    //         let query = { userId: ObjectId(req.body.id), role: 'grand-master' }
    //         console.log(query);
    //         if (search != '') {
    //             query = { email: { $regex: '.*' + search + '.*' }, userId:ObjectId(req.body.id), role: 'grand-master' };
    //         }
    //         let data = await Sys.App.Services.UserServices.getUserDatatable(query, start);
    //         console.log("data", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },

    // PlayerListPost: async function(req, res) {
    //     try {
    //         console.log("maulik",req.body);
    //         let start = parseInt(req.body.start);
    //         const ObjectId = mongoose.Types.ObjectId;
    //         let length = parseInt(req.body.length);
    //         let search = req.body.search.value;
    //         let query = { user: ObjectId(req.body.id)}
    //         console.log("query", query);
    //         if (search != '') {
    //             query = { email: { $regex: '.*' + search + '.*' }, user: ObjectId(req.body.id) };
    //         }
    //         let data = await Sys.App.Services.PlayerServices.getByData(query, length, start);
    //         console.log("dataPlayer", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // masterPlayerListPost: async function(req, res) {
    //     try {
    //         console.log(req.body);
    //         let start = parseInt(req.body.start);
    //         let length = parseInt(req.body.length);
    //         let search = req.body.search.value;
    //         let query = { user: req.body.id }
    //         console.log(query);
    //         if (search != '') {
    //             query = { email: { $regex: '.*' + search + '.*' }, user: req.body.id };
    //         }
    //         let data = await Sys.App.Services.PlayerServices.getByData(query, length, start);
    //         console.log("data", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // grandMasterPlayerEdit: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({ _id: req.params.id });
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             playerActive: 'active',
    //             player: player
    //         };
    //         return res.render('player/grandMasterPlayerEdit', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // grandMasterPlayerEditPost: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.PlayerServices.getPlayerData({ _id: req.params.id });
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ _id: player[0].user })
    //         let playerName = await Sys.App.Services.PlayerServices.getPlayerData({ username: req.body.username });
    //         let playerEmail = await Sys.App.Services.PlayerServices.getPlayerData({email: req.body.email})
    //         let playerDetails = await Sys.App.Services.PlayerServices.getPlayerData({$or:[{username: req.body.username},{email: req.body.email}]})
    //         console.log("malik",playerDetails);

    //     if(playerEmail.length > 0 && playerEmail[0]._id == req.params.id && playerName.length == 0){
    //         if (player && player.length > 0) {
    //                     await Sys.App.Services.PlayerServices.updatePlayerData({
    //                         _id: req.params.id
    //                     }, {
    //                         username: req.body.username,
    //                         email: req.body.email,
    //                     })
    //                     req.flash('success', 'Player update successfully');
    //                     res.redirect('/grandMasterPlayerList/' + userData._id);

    //                 } else {
    //                     req.flash('error', 'No User found');
    //                     res.redirect('..');
    //                     return;
    //                 }
    //     }else if( playerName.length > 0 &&  playerName[0]._id == req.params.id &&playerEmail.length == 0){
    //         if (player && player.length > 0) {

    //             await Sys.App.Services.PlayerServices.updatePlayerData({
    //                 _id: req.params.id
    //             }, {
    //                 username: req.body.username,
    //                 email: req.body.email,
    //             })
    //             req.flash('success', 'Player update successfully');
    //             res.redirect('/grandMasterPlayerList/' + userData._id);

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('..');
    //             return;
    //         }
    //     }
    //      else if(playerEmail.length == 0 && playerName.length == 0){
    //         if (player && player.length > 0) {

    //             await Sys.App.Services.PlayerServices.updatePlayerData({
    //                 _id: req.params.id
    //             }, {
    //                 username: req.body.username,
    //                 email: req.body.email,
    //             })
    //             req.flash('success', 'Player update successfully');
    //             res.redirect('/grandMasterPlayerList/' + userData._id);

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('..');
    //             return;
    //         }
    //     }
    //     else{
    //         req.flash('error', 'Player already present');
    //         res.redirect('/grandMasterPlayerList/' + userData._id);
    //     }

    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // playerStatus: async function(req, res) {
    //     try {
    //         console.log("call palyer Status");
    //         let player = await Sys.App.Services.PlayerServices.getOneByData({ _id: req.body.id });
    //         console.log("player", player);
    //         var siteOwner
    //         if (player.status == 'active') {
    //             siteOwner = "block"

    //         } else {
    //             siteOwner = "active"
    //         }
    //         if (player || player.length > 0) {
    //             await Sys.App.Services.PlayerServices.updatePlayerData({ _id: req.body.id }, { status: siteOwner })
    //             return res.send("success");
    //         } else {
    //             return res.send("error");
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // grandMasterEdit: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getByData({_id: req.session.details.id})
    //         let player = await Sys.App.Services.UserServices.getOneByData({ _id: req.params.id });
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:player.role})
    //         console.log("player", player);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             grandMaster: 'active',
    //             Owner: 'active',
    //             user: "active",
    //             player: player,
    //             userData: user[0].commission,
    //             commissionRange:commissionRange
    //         };
    //         return res.render('user/grandMasterEdit', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // grandMasterEditPost: async function(req, res) {
    //     try {
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ _id: req.params.id })
    //         let siteOwnerData = await Sys.App.Services.UserServices.getOneByData({ _id: userData.userId })
    //         let grandMasterDownLine = await Sys.App.Services.UserServices.getUserData({userId:req.params.id})
    //         let userName = await Sys.App.Services.UserServices.getUserData({name: req.body.username})
    //         console.log("username",userName);
    //         console.log("username",req.body.username);
    //         if (userName.length == 0 || req.params.id == userName[0]._id ) {
    //         if (userData) {
    //             let grandTotalCommission = req.body.commission * siteOwnerData.commission / 100
    //             if(grandMasterDownLine.length){
    //                 for(let grandMaster = 0; grandMaster < grandMasterDownLine.length;grandMaster++){
    //                     let masterTotalCommission = grandMasterDownLine[grandMaster].totalCommission * grandTotalCommission / 100
    //                     await Sys.App.Services.UserServices.updateUserData({
    //                         _id: grandMasterDownLine[grandMaster]._id
    //                     }, {
    //                         commission: masterTotalCommission,
    //                     })
    //                     masterDownLine = await Sys.App.Services.UserServices.getUserData({ userId: grandMasterDownLine[grandMaster]._id })
    //                     if(masterDownLine.length){
    //                         for(let master=0; master<masterDownLine.length;master++){
    //                             if (JSON.stringify(grandMasterDownLine[grandMaster]._id)== JSON.stringify(masterDownLine[master].userId)) {
    //                                 let agentTotalCommission = masterDownLine[master].totalCommission * masterTotalCommission / 100
    //                                 await Sys.App.Services.UserServices.updateUserData({
    //                                     _id: masterDownLine[master]._id
    //                                 }, {
    //                                     commission: agentTotalCommission,
    //                                 })
    //                             }
    //                         }
    //                     }
    //                 } 
    //             }
    //             await Sys.App.Services.UserServices.updateUserData({
    //                 _id: req.params.id
    //             }, {
    //                 name: req.body.username,
    //                 mobile: Number(req.body.mobile),
    //                 totalCommission:req.body.commission,
    //                 commission: grandTotalCommission,
    //                 referralCode: req.body.referralCode,
    //                 status: req.body.status
    //             })
    //             req.flash('success', 'User Updated Successfully');
    //             res.redirect('/grandMasterPlayerList/' + userData.userId);

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('/dashboard');
    //             return;
    //         }
    //     }
    //     else{
    //             req.flash('error', 'User already present');
    //             res.redirect('/grandMasterPlayerList/' + userData.userId);
    //             return;
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // subAdmin: async function(req, res) {

    //     try {
    //         let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //         req.session.details.chips = parseFloat(userDetails.chips).toFixed(2)
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             subAdminActive: 'active',
    //         };
    //         return res.render('user/subAdmin', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // getSubAdmin: async function(req, res) {
    //     console.log(req.query);
    //     try {
    //         let start = parseInt(req.query.start);
    //         let length = parseInt(req.query.length);
    //         let search = req.query.search.value;
    //         let status = req.query.status

    //         let query = { role: "sub-admin" }


    //         if (search != '') {
    //             query = { name: { $regex: '.*' + search + '.*' }, role: "sub-admin" };
    //         }

    //         let playersC = await Sys.App.Services.UserServices.getUserData(query);
    //         let playersCount = playersC.length;
    //         let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);
    //         console.log("data", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'recordsTotal': playersCount,
    //             'recordsFiltered': playersCount,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addSubAdmin: async function(req, res) {
    //     try {

    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             userActive: 'active'
    //         };
    //         return res.render('user/addSubAdmin', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addSubAdminData: async function(req, res) {
    //     console.log("callllll");
    //     try {
    //         console.log(req.files);
    //         let player = await Sys.App.Services.UserServices.getUserData({ email: req.body.email});
    //         let userNameData = await Sys.App.Services.UserServices.getUserData({ name: req.body.username})
    //         if(userNameData.length > 0){
    //             req.flash('error', 'User Already Present');
    //             res.redirect('/subAdmin');
    //             return;
    //         }
    //         if (player && player.length > 0) {
    //             req.flash('error', 'User Already Present');
    //             res.redirect('/subAdmin');
    //             return;
    //         } else {
    //             let image
    //             if (req.files) {
    //                 var profileImage = req.files.image;
    //                 console.log("profileImage", profileImage);
    //                 var tempNum = helper.randomNumber(4);
    //                 var datetime = dateformat(new Date(), 'yyyymmddHHMMss');
    //                 var imageName = 'dist/img/' + datetime + tempNum + ".jpg";
    //                 await profileImage.mv('public/' + imageName);
    //                 image = imageName;
    //                 imagePath = imageName;
    //             }
    //             console.log("image", image);

    //             await Sys.App.Services.UserServices.insertUserData({
    //                 name: req.body.username,
    //                 email: req.body.email,
    //                 role: 'sub-admin',
    //                 status: req.body.status,
    //                 password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
    //                 mobile: req.body.mobile,
    //                 userId: req.session.details.id,
    //                 image: '/' + image,
    //             })
    //             req.flash('success', 'User create successfully');
    //             res.redirect('/subAdmin');
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // masterOfGrandmasterEdit: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getByData({_id: req.session.details.id})
    //         let player = await Sys.App.Services.UserServices.getOneByData({ _id: req.params.id });
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:player.role})
    //         console.log("player", player);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             grandMaster: 'active',
    //             Owner: 'active',
    //             user: "active",
    //             player: player,
    //             userData: user[0].commission,
    //             commissionRange:commissionRange
    //         };
    //         return res.render('user/masterEdit', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // masterOfGrandmasterEditPost: async function(req, res) {
    //     try {
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ _id: req.params.id })
    //         let grandMasterData =  await Sys.App.Services.UserServices.getUserData({ _id: userData.userId });
    //         let masterDownLine =  await Sys.App.Services.UserServices.getUserData({ userId: req.params.id});
    //         let userName = await Sys.App.Services.UserServices.getUserData({name: req.body.username})
    //         console.log("username",userName);
    //         console.log("username",req.body.username);
    //         if(userName.length == 0 || userName[0]._id == req.params.id){
    //         console.log(userData);
    //         if (userData) {
    //             let masterTotalCommission = req.body.commission * grandMasterData[0].commission / 100
    //             if(masterDownLine.length){
    //                 for(let master=0;master<masterDownLine.length;master++){
    //                     let agentTotalCommission = masterTotalCommission * masterDownLine[master].totalCommission / 100
    //                     await Sys.App.Services.UserServices.updateUserData({
    //                         _id: masterDownLine[master]._id
    //                     }, {
    //                         commission: agentTotalCommission,
    //                     })
    //                 } 
    //             }
    //             await Sys.App.Services.UserServices.updateUserData({
    //                 _id: req.params.id
    //             }, {
    //                 name: req.body.username,
    //                 mobile: Number(req.body.mobile),
    //                 totalCommission: req.body.commission,
    //                 commission: masterTotalCommission,
    //                 referralCode: req.body.referralCode,
    //                 status: req.body.status
    //             })
    //             req.flash('success', 'User Updated Successfully');
    //             res.redirect('/masterPlayerList/' + userData.userId);

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('/dashboard');
    //             return;
    //         }
    //     }
    //     else{
    //         req.flash('error', 'User already present');
    //             res.redirect('/masterPlayerList/' + userData.userId);
    //             return;
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editSubAdmin: async function(req, res) {
    //     try {
    //         console.log("calll");
    //         let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id });
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             subAdminActive: 'active',
    //             user: user
    //         };
    //         return res.render('user/addSubAdmin', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editSubAdminPostData: async function(req, res) {
    //     try {
    //         console.log(req.files);
    //         let player = await Sys.App.Services.UserServices.getUserData({ _id: req.params.id });
    //         let userNamedata = await Sys.App.Services.UserServices.getUserData({ name:req.body.username });

    //         if (userNamedata.length == 0 || req.params.id == userNamedata[0]._id ) {
    //         if (player && player.length > 0) {

    //             if (req.files) {
    //                 let image = req.files.image;

    //                 // Use the mv() method to place the file somewhere on your server
    //                 image.mv('public/dist/img/' + req.files.image.name, function(err) {
    //                     if (err) {
    //                         req.flash('error', 'User Already Present');
    //                         return res.redirect('/subAdmin');
    //                     }

    //                     // res.send('File uploaded!');
    //                 });
    //             }
    //             await Sys.App.Services.UserServices.updateUserData({
    //                 _id: req.params.id
    //             }, {
    //                 name: req.body.username,
    //                 role: 'sub-admin',
    //                 status: req.body.status,
    //                 image: '/dist/img/' + req.files.image.name,
    //                 referralCode: req.body.referralCode,
    //                 commission: req.body.commission,
    //                 mobile: req.body.mobile,
    //             })
    //             req.flash('success', 'User update successfully');
    //             res.redirect('/subAdmin');

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('/');
    //             return;
    //         }
    //     }
    //     else{
    //         req.flash('error', 'User already present');
    //         res.redirect('/subAdmin');
    //         return;
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // grandMaster: async function(req, res) {
    //     try {
    //         let userDetails = await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id });
    //         let roleData = await Sys.App.Services.UserServices.getRole({ name: req.session.details.name })
    //         var roleApprove
    //         let UserDetails = await Sys.App.Services.UserServices.getOneByData({ _id: req.session.details.id })

    //         console.log("roleData",roleData);
    //         req.session.details.chips = parseFloat(UserDetails.chips).toFixed(2)
    //         if (roleData == null) {
    //             console.log('22222');

    //             roleApprove = ""
    //         } else {
    //             console.log('33333');

    //             roleApprove = roleData.permission['Grand Master Management']
    //         }
    //         console.log("userDetails",userDetails);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             grandMaster: 'active',
    //             roleData: (req.session.details.role == 'admin') ? "" : roleApprove,
    //         };
    //         req.session.details.chips = parseFloat(userDetails[0].chips).toFixed(2)
    //         return res.render('grandMaster/grandMaster', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // getGrandMaster: async function(req, res) {
    //     try {
    //         console.log("yessss");
    //         let start = parseInt(req.query.start);
    //         let length = parseInt(req.query.length);
    //         let search = req.query.search.value;

    //         let query = { userId: req.session.details.id, role: 'grand-master' }
    //         console.log(query);
    //         if (search != '') {
    //             query = { name: { $regex: '.*' + search + '.*' }, userId: req.session.details.id, role: 'grand-master' };
    //         }
    //         let columns = [
    //             'id',
    //             'username',
    //             'firstname',
    //             'lastname',
    //             'email',
    //             'chips',
    //             'status',
    //             'isBot',
    //         ]
    //         let playersC = await Sys.App.Services.UserServices.getUserData(query);
    //         let playersCount = playersC.length;
    //         let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);
    //         console.log("data", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'recordsTotal': playersCount,
    //             'recordsFiltered': playersCount,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addGrandMaster: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id });
    //         let referralCodeGenerator = require('referral-code-generator')
    //         let code = referralCodeGenerator.alphaNumeric('uppercase', 2, 2)
    //         console.log("referralCodeGenerator", referralCodeGenerator.alphaNumeric('uppercase', 2, 2));
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:'grand-master'})
    //         console.log(commissionRange);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             userActive: 'active',
    //             referral: code,
    //             commissionRange:commissionRange,
    //             player:0,
    //             userData:user[0].commission
    //         };
    //         return res.render('grandMaster/addGrandMaster', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addGrandMasterPostData: async function(req, res) {
    //     try {
    //         let siteOwnerData =  await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id })
    //         let player = await Sys.App.Services.UserServices.getUserData({ email: req.body.email });
    //         let userNameData = await Sys.App.Services.UserServices.getUserData({ name:req.body.username });
    //         if (player && player.length > 0 || userNameData && userNameData.length > 0) {
    //             req.flash('error', 'User Already Present');
    //             res.redirect('/grandMaster');
    //             return;
    //         } else {
    //             let grandMasterTotalCommission = req.body.commission * siteOwnerData[0].commission / 100
    //             let player = await Sys.App.Services.UserServices.getUserCount({ referralCode: req.body.referralCode });
    //             if (player) {
    //                 req.flash('error', 'Referral Code Already Present');
    //                 res.redirect('/grandMaster');
    //                 return;
    //             }
    //             await Sys.App.Services.UserServices.insertUserData({
    //                 name: req.body.username,
    //                 email: req.body.email,
    //                 status: req.body.status,
    //                 password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
    //                 role: 'grand-master',
    //                 userId: req.session.details.id,
    //                 referralCode: req.body.referralCode,
    //                 totalCommission:req.body.commission,
    //                 commission: grandMasterTotalCommission,
    //                 mobile: req.body.mobile,
    //             })
    //             req.flash('success', 'User create successfully');
    //             res.redirect('/grandMaster');
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editGrandMasterStatus: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.UserServices.getUserData({ _id: req.body.id });
    //         console.log(player);
    //         var siteOwner
    //         if (player[0].status == "active") {
    //             siteOwner = "inactive"
    //         } else {
    //             siteOwner = "active"
    //         }
    //         if (player || player.length > 0) {
    //             await Sys.App.Services.UserServices.updateUserData({ _id: req.body.id }, { status: siteOwner })
    //             return res.send("success");
    //         } else {
    //             return res.send("error");
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // siteGrandMasterEdit: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id });
    //         let player = await Sys.App.Services.UserServices.getOneByData({ _id: req.params.id });
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:'grand-master'})
    //         console.log(commissionRange);
    //         console.log("player", player);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             grandMaster: 'active',
    //             user: player,
    //             commissionRange:commissionRange,
    //             userData:user[0].commission
    //         };
    //         return res.render('grandMaster/addGrandMaster', data);
    //         // res.send(player);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // grandMasterEditPostData: async function(req, res) {
    //     try {
    //         let siteOwnerData = await Sys.App.Services.UserServices.getOneByData({ _id: req.session.details.id })
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ _id: req.params.id })
    //         let userName = await Sys.App.Services.UserServices.getUserData({name: req.body.username})
    //         let grandMasterDownLine = await Sys.App.Services.UserServices.getUserData({userId:req.params.id})
    //         let masterDownLine = []
    //         if(userName.length == 0 || req.params.id == userName[0]._id){
    //         if (userData) {
    //             let grandTotalCommission = req.body.commission * siteOwnerData.commission / 100
    //             // for (let gm = 0; gm < grandMasterDownLine.length; gm++) {
    //             //     masterDownLine = await Sys.App.Services.UserServices.getUserData({ userId: grandMasterDownLine[gm]._id })
    //             // }
    //             console.log("grandMasterDownLine",grandMasterDownLine);
    //             console.log("masterDownLine",masterDownLine);
    //             if(grandMasterDownLine.length){
    //                 for(let grandMaster = 0; grandMaster < grandMasterDownLine.length;grandMaster++){
    //                     let masterTotalCommission = grandMasterDownLine[grandMaster].totalCommission * grandTotalCommission / 100
    //                     await Sys.App.Services.UserServices.updateUserData({
    //                         _id: grandMasterDownLine[grandMaster]._id
    //                     }, {
    //                         commission: masterTotalCommission,
    //                     })
    //                     masterDownLine = await Sys.App.Services.UserServices.getUserData({ userId: grandMasterDownLine[grandMaster]._id })
    //                     if(masterDownLine.length){
    //                         for(let master=0; master<masterDownLine.length;master++){
    //                             if (JSON.stringify(grandMasterDownLine[grandMaster]._id)== JSON.stringify(masterDownLine[master].userId)) {
    //                                 let agentTotalCommission = masterDownLine[master].totalCommission * masterTotalCommission / 100
    //                                 await Sys.App.Services.UserServices.updateUserData({
    //                                     _id: masterDownLine[master]._id
    //                                 }, {
    //                                     commission: agentTotalCommission,
    //                                 })
    //                             }
    //                         }
    //                     }
    //                 } 
    //             }
    //             console.log("siteOwnerData",siteOwnerData);
    //             // for (let gm = 0; gm < grandMasterDownLine.length; gm++) {
    //             //     masterDownLine = await Sys.App.Services.UserServices.getUserData({ userId: grandMasterDownLine[so]._id })
    //             //     for (let gm = 0; gm < grandMasterDownLine.length; gm++) {
    //             //         agentDownLine = await Sys.App.Services.UserServices.getUserData({ userId: grandMasterDownLine[gm]._id })
    //             //     }
    //             // }
    //             // for (let grandMaster = 0; grandMaster < grandMasterDownLine.length; grandMaster++) {
    //             //     let masterTotalCommission = grandMasterDownLine[grandMaster].totalCommission * req.body.commission / 100
    //             //     await Sys.App.Services.UserServices.updateUserData({
    //             //         _id: grandMasterDownLine[grandMaster]._id
    //             //     }, {
    //             //         commission: masterTotalCommission,
    //             //     })
    //             //     for (let master = 0; master < agentDownLine.length; agent++) {
    //             //         if (JSON.stringify(grandMasterDownLine[grandMaster]._id) == JSON.stringify(agentDownLine[agent].userId)) {
    //             //             let agentTotalCommission = grandMasterDownLine[grandMaster].totalCommission * grandMasterTotalCommission / 100
    //             //             await Sys.App.Services.UserServices.updateUserData({
    //             //                 _id: grandMasterDownLine[grandMaster]._id
    //             //             }, {
    //             //                 commission: masterTotalCommission,
    //             //             })
    //             //         }
    //             //     }
    //             // }

    //             await Sys.App.Services.UserServices.updateUserData({
    //                 _id: req.params.id
    //             }, {
    //                 name: req.body.username,
    //                 mobile: Number(req.body.mobile),
    //                 totalCommission:req.body.commission,
    //                 commission: grandTotalCommission,
    //                 referralCode: req.body.referralCode,
    //                 status: req.body.status,
    //             })
    //             req.flash('success', 'User Updated Successfully');
    //             res.redirect('/grandMaster');

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('/dashboard');
    //             return;
    //         }
    //     }else{
    //             req.flash('error', 'User already present');
    //             res.redirect('/grandMaster');
    //             return;
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addDeductChipsGrandMaster: async function(req, res) {
    //     try {

    //         console.log("call");
    //         let operation = req.body.chipsValue;
    //         let chips = req.body.chips;
    //         chips = Number(chips);
    //         if(chips <= 0 ){
    //             req.flash('error', 'Please enter valid chips.');
    //             res.redirect('/grandMaster');
    //         }
    //         else{
    //         let chipNote = req.body.chipsNote
    //         console.log(req.body.userId)
    //         let User = await Sys.App.Services.UserServices.getOneByData({ _id: req.body.userId })
    //         if (User) {
    //             if (operation == "Add") {
    //                 let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                 console.log(userDetails);
    //                 if (userDetails.chips >= chips) {
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: -chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User._id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: userDetails.role,
    //                         providerId: User.id,
    //                         providerRole: User.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + User.username,
    //                         remark: 'Transaction To ' + User.username,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(userDetails.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + userDetails.email,
    //                         remark: 'Received From ' + userDetails.email,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(User.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:userDetails.name,
    //                         to:User.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"credit",
    //                         transactionId:'CR-' + traNumber
    //                     })
    //                     req.flash('success', 'Chips Added Successfully')
    //                     res.redirect('/grandMaster');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient admin chips.');
    //                     res.redirect('/grandMaster');
    //                     return;
    //                 }
    //             } else if (operation == 'Deduct') {
    //                 if (User.chips >= chips) {
    //                     let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User.id }, { $inc: { chips: -chips } });
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: User.role,
    //                         providerId: User.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + User.username,
    //                         remark: 'Received From ' + User.username,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(userDetails.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + userDetails.email,
    //                         remark: 'Transaction To ' + userDetails.email,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(User.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         category: 'debit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:userDetails.name,
    //                         to:User.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"debit",
    //                         transactionId:'DE-' + traNumber
    //                     })
    //                     req.session.details.chips = parseFloat(userDetails.chips).toFixed(2)
    //                     req.flash('success', 'Chips Deduct Successfully')
    //                     res.redirect('/grandMaster');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient User chips.');
    //                     res.redirect('/grandMaster');
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addDeductChipsMasterOfGrandmaster: async function(req, res) {
    //     try {
    //         console.log("call");
    //         console.log("maulik",req.params.id);
    //         let operation = req.body.chipsValue;
    //         let chips = req.body.chips;
    //         chips = Number(chips);
    //         if(chips <=0 ){
    //             req.flash('error', 'Please enter valid chips.');
    //             res.redirect('/masterPlayerList/'+ req.params.id);
    //         }else{
    //         let chipNote = req.body.chipsNote
    //         console.log(req.body.userId)
    //         let User = await Sys.App.Services.UserServices.getOneByData({ _id: req.body.userId })
    //         if (User) {
    //             if (operation == "Add") {
    //                 let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                 console.log(userDetails);
    //                 if (userDetails.chips >= chips) {
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: -chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User._id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: userDetails.role,
    //                         providerId: User.id,
    //                         providerRole: User.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + User.username,
    //                         remark: 'Transaction To ' + User.username,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(userDetails.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + userDetails.email,
    //                         remark: 'Received From ' + userDetails.email,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(User.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:userDetails.name,
    //                         to:User.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"credit",
    //                         transactionId:'CR-' + traNumber
    //                     })
    //                     req.flash('success', 'Chips Added Successfully')
    //                     res.redirect('/masterPlayerList/'+ req.params.id);
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient admin chips.');
    //                     res.redirect('/masterPlayerList/'+ req.params.id);
    //                     return;
    //                 }
    //             } else if (operation == 'Deduct') {
    //                 if (User.chips >= chips) {
    //                     let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User.id }, { $inc: { chips: -chips } });
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: User.role,
    //                         providerId: User.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + User.username,
    //                         remark: 'Received From ' + User.username,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(userDetails.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + userDetails.email,
    //                         remark: 'Transaction To ' + userDetails.email,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(User.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         category: 'debit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:User.name,
    //                         to:userDetails.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"debit",
    //                         transactionId:'DE-' + traNumber
    //                     })
    //                     req.session.details.chips = parseFloat(userDetails.chips).toFixed(2)
    //                     req.flash('success', 'Chips Deduct Successfully')
    //                     res.redirect('/masterPlayerList/'+ req.params.id);
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient User chips.');
    //                     res.redirect('/masterPlayerList/'+ req.params.id);
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addDeductChipsMasterOfSiteOwner: async function(req, res) {
    //     try {
    //         console.log("call");
    //         console.log("maulik",req.params.id);
    //         let operation = req.body.chipsValue;
    //         let chips = req.body.chips;
    //         chips = Number(chips);
    //         if(chips <= 0){
    //             req.flash('error', 'Please enter valid chips.');
    //             res.redirect('/grandMasterPlayerList/'+ req.params.id);
    //         }else{
    //         let chipNote = req.body.chipsNote
    //         console.log(req.body.userId)
    //         let User = await Sys.App.Services.UserServices.getOneByData({ _id: req.body.userId })
    //         if (User) {
    //             if (operation == "Add") {
    //                 let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                 console.log(userDetails);
    //                 if (userDetails.chips >= chips) {
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: -chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User._id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: userDetails.role,
    //                         providerId: User.id,
    //                         providerRole: User.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + User.username,
    //                         remark: 'Transaction To ' + User.username,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(userDetails.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + userDetails.email,
    //                         remark: 'Received From ' + userDetails.email,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(User.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:userDetails.name,
    //                         to:User.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"credit",
    //                         transactionId:'CR-' + traNumber
    //                     })
    //                     req.flash('success', 'Chips Added Successfully')
    //                     res.redirect('/grandMasterPlayerList/'+ req.params.id);
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient admin chips.');
    //                     res.redirect('/grandMasterPlayerList/'+ req.params.id);
    //                     return;
    //                 }
    //             } else if (operation == 'Deduct') {
    //                 if (User.chips >= chips) {
    //                     let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User.id }, { $inc: { chips: -chips } });
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: User.role,
    //                         providerId: User.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + User.username,
    //                         remark: 'Received From ' + User.username,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(userDetails.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + userDetails.email,
    //                         remark: 'Transaction To ' + userDetails.email,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(User.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         category: 'debit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:User.name,
    //                         to:userDetails.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"debit",
    //                         transactionId:'DE-' + traNumber
    //                     })
    //                     req.session.details.chips = parseFloat(userDetails.chips).toFixed(2)
    //                     req.flash('success', 'Chips Deduct Successfully')
    //                     res.redirect('/grandMasterPlayerList/'+ req.params.id);
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient User chips.');
    //                     res.redirect('/grandMasterPlayerList/'+ req.params.id);
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // masterPlayerList: async function(req, res) {
    //     try {
    //         console.log(req.params.id);
    //         let grandMasterData = await Sys.App.Services.UserServices.getUserDatatable({ _id: req.params.id })
    //         let grandMaster = await Sys.App.Services.UserServices.getUserDatatable({ _id: grandMasterData[0].userId })
    //         console.log(grandMasterData);
    //         req.session.details.chips = grandMaster[0].chips
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             grandMaster: 'active',
    //             Owner: 'active',
    //             user: "active",
    //             id: req.params.id,
    //             name: grandMasterData[0].name
    //         };
    //         return res.render('grandMaster/masterPlayerList', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // masterPlayerListGet: async function(req, res) {
    //     try {
    //         console.log("mmmmmmmmmmmmm", req.body);
    //         let start = parseInt(req.body.start);
    //         let search = req.body.search.value;

    //         let query = { userId: req.body.id, role: 'master' }
    //         console.log(query);
    //         if (search != '') {
    //             let capital = search;
    //             query = { email: { $regex: '.*' + search + '.*' }, userId: req.body.id, role: 'master' };
    //         }
    //         let data = await Sys.App.Services.UserServices.getUserDatatable(query, start);
    //         console.log("data", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // masterEdit: async function(req, res) {
    //     try {
    //         const ObjectId = mongoose.Types.ObjectId;
    //         console.log(typeof(req.params.id));
    //         let user = await Sys.App.Services.UserServices.getOneByData({ _id: req.session.details.id })
    //         let player = await Sys.App.Services.UserServices.getOneByData({ _id: ObjectId(req.params.id) });
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:'master'})
    //         console.log("player", player);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             grandMaster: 'active',
    //             Owner: 'active',
    //             user: "active",
    //             player: player,
    //             userData: user[0].commission,
    //             commissionRange:commissionRange,
    //         };
    //         return res.render('grandMaster/masterEdit', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // masterEditPost: async function(req, res) {
    //     try {
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ _id: req.params.id })
    //         let userName = await Sys.App.Services.UserServices.getUserData({name: req.body.username})
    //         if(userName.length == 0 || req.params.id == userName[0]._id){
    //         console.log("userData", userData);
    //         if (userData) {

    //             await Sys.App.Services.UserServices.updateUserData({
    //                 _id: req.params.id
    //             }, {
    //                 name: req.body.username,
    //                 mobile: Number(req.body.mobile),
    //                 commission: req.body.commission,
    //                 referralCode: req.body.referralCode,
    //                 status: req.body.status
    //             })
    //             req.flash('success', 'User Updated Successfully');
    //             res.redirect('/masterPlayerList/' + userData.userId);

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('/dashboard');
    //             return;
    //         }
    //     }else{
    //         req.flash('error', 'User already present');
    //         res.redirect('/grandMaster');
    //         return;
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // playerEditOfMaster: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({ _id: req.params.id });
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ _id: player.user })
    //         console.log(userData);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             loginId: userData._id,
    //             playerActive: 'active',
    //             player: player
    //         };
    //         return res.render('player/masterPlayerEdit', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // playerEditOfMasterEditPost: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.PlayerServices.getPlayerData({ _id: req.params.id });
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ userId: player[0].user })
    //         let playerName = await Sys.App.Services.PlayerServices.getPlayerData({ username: req.body.username })
    //         let playerEmail = await Sys.App.Services.PlayerServices.getPlayerData({ email: req.body.email })

    //         console.log("userData", userData);


    //         if(playerEmail.length > 0 && playerEmail[0]._id == req.params.id && playerName.length == 0){
    //             if (player && player.length > 0) {

    //                         await Sys.App.Services.PlayerServices.updatePlayerData({
    //                             _id: req.params.id
    //                         }, {
    //                             username: req.body.username,
    //                             email: req.body.email,
    //                         })
    //                         req.flash('success', 'Player update successfully');
    //                         res.redirect('/masterPlayerList/' + userData.userId);

    //                     } else {
    //                         req.flash('error', 'No User found');
    //                         res.redirect('..');
    //                         return;
    //                     }
    //         }else if(playerName.length > 0 && playerName[0]._id == req.params.id && playerEmail.length == 0){
    //             if (player && player.length > 0) {

    //                 await Sys.App.Services.PlayerServices.updatePlayerData({
    //                     _id: req.params.id
    //                 }, {
    //                     username: req.body.username,
    //                     email: req.body.email,
    //                 })
    //                 req.flash('success', 'Player update successfully');
    //                 res.redirect('/masterPlayerList/' + userData.userId);

    //             } else {
    //                 req.flash('error', 'No User found');
    //                 res.redirect('..');
    //                 return;
    //             }
    //         }
    //         else if(playerEmail.length == 0 && playerName.length == 0){
    //             if (player && player.length > 0) {

    //                 await Sys.App.Services.PlayerServices.updatePlayerData({
    //                     _id: req.params.id
    //                 }, {
    //                     username: req.body.username,
    //                     email: req.body.email,
    //                 })
    //                 req.flash('success', 'Player update successfully');
    //                 res.redirect('/masterPlayerList/' + userData.userId);

    //             } else {
    //                 req.flash('error', 'No User found');
    //                 res.redirect('..');
    //                 return;
    //             }
    //         }
    //          else {
    //             req.flash('error', 'Player already present.');
    //             res.redirect('/masterPlayerList/' + userData.userId);
    //             return;
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // master: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getUserData({_id:req.session.details.id});
    //         let roleData = await Sys.App.Services.UserServices.getRole({ name: req.session.details.name })
    //         var roleApprove
    //         let UserDetails = await Sys.App.Services.UserServices.getOneByData({ _id: req.session.details.id })

    //         console.log("roleData",roleData);
    //         req.session.details.chips = parseFloat(UserDetails.chips).toFixed(2)
    //         if (roleData == null) {
    //             console.log('22222');

    //             roleApprove = ""
    //         } else {
    //             console.log('33333');

    //             roleApprove = roleData.permission['Master Management']
    //         }
    //         console.log(roleApprove[0]);
    //         req.session.details.chips = parseFloat(user[0].chips).toFixed(2)
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             masterActive: 'active',
    //             roleData: (req.session.details.role == 'admin') ? "" : roleApprove,
    //         };
    //         return res.render('grandMaster/master', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // getMaster: async function(req, res) {
    //     try {
    //         console.log("yessss");
    //         let start = parseInt(req.query.start);
    //         let length = parseInt(req.query.length);
    //         let search = req.query.search.value;

    //         let query = { userId: req.session.details.id, role: 'master' }
    //         console.log(query);
    //         if (search != '') {
    //             query = { name: { $regex: '.*' + search + '.*' }, userId: req.session.details.id, role: 'master' };
    //         }

    //         let playersC = await Sys.App.Services.UserServices.getUserData(query);
    //         let playersCount = playersC.length;
    //         let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);
    //         console.log("data", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'recordsTotal': playersCount,
    //             'recordsFiltered': playersCount,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // agentPlayerList: async function(req, res) {
    //     try {
    //         console.log(req.params.id);
    //         let grandMasterData = await Sys.App.Services.UserServices.getUserDatatable({ _id: req.params.id })
    //         let grandMaster = await Sys.App.Services.UserServices.getUserDatatable({ _id: grandMasterData[0].userId })
    //         console.log("grandMasterData",grandMasterData);
    //         req.session.details.chips = parseFloat(grandMaster[0].chips).toFixed(2)
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             grandMaster: 'active',
    //             Owner: 'active',
    //             user: "active",
    //             id: req.params.id,
    //             name: grandMasterData[0].name
    //         };
    //         return res.render('grandMaster/agentPlayerList', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // agentPlayerListGet: async function(req, res) {
    //     try {
    //         console.log("call", req.body);
    //         let start = parseInt(req.body.start);
    //         let search = req.body.search.value;

    //         let query = { userId: req.body.id, role: 'agent' }
    //         console.log(query);
    //         if (search != '') {
    //             query = { email: { $regex: '.*' + search + '.*' }, userId: req.body.id, role: 'agent' };
    //         }
    //         let data = await Sys.App.Services.UserServices.getUserDatatable(query, start);
    //         console.log("data", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addMaster: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id});
    //         console.log("user",user[0].commission);
    //         let referralCodeGenerator = require('referral-code-generator')
    //         let code = referralCodeGenerator.alphaNumeric('uppercase', 2, 2)
    //         console.log("referralCodeGenerator", referralCodeGenerator.alphaNumeric('uppercase', 2, 2));
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:'master'})
    //         console.log(commissionRange);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             masterActive: 'active',
    //             referral: code,
    //             commissionRange:commissionRange,
    //             userData: user[0].commission
    //         };
    //         return res.render('grandMaster/addMaster', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addMasterPostData: async function(req, res) {
    //     try {
    //         let grandMasterData  = await Sys.App.Services.UserServices.getUserData({_id:req.session.details.id});
    //         let player = await Sys.App.Services.UserServices.getUserData({ email: req.body.email});
    //         let userNameData = await Sys.App.Services.UserServices.getUserData({name: req.body.username })
    //         if (player && player.length > 0 || userNameData && userNameData.length > 0) {
    //             req.flash('error', 'User Already Present');
    //             res.redirect('/master');
    //             return;
    //         } else {
    //             let player = await Sys.App.Services.UserServices.getUserCount({ referralCode: req.body.referralCode });
    //             if (player) {
    //                 req.flash('error', 'Referral Code Already Present');
    //                 res.redirect('/master');
    //                 return;
    //             }
    //             let masterTotalCommission = grandMasterData[0].commission * req.body.commission / 100
    //             await Sys.App.Services.UserServices.insertUserData({
    //                 name: req.body.username,
    //                 email: req.body.email,
    //                 status: req.body.status,
    //                 password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
    //                 role: 'master',
    //                 userId: req.session.details.id,
    //                 referralCode: req.body.referralCode,
    //                 totalCommission: req.body.commission,
    //                 commission: masterTotalCommission,
    //                 mobile: req.body.mobile,
    //             })
    //             req.flash('success', 'User create successfully');
    //             res.redirect('/master');
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addDeductChipsMaster: async function(req, res) {
    //     try {
    //         let operation = req.body.chipsValue;
    //         let chips = req.body.chips;
    //         chips = Number(chips);
    //         if (chips <= 0){
    //             req.flash('error', 'Please enter valid chips.');
    //             res.redirect('/master');
    //         }else{
    //         let chipNote = req.body.chipsNote
    //         console.log(req.body.userId)
    //         let User = await Sys.App.Services.UserServices.getOneByData({ _id: req.body.userId })
    //         if (User) {
    //             if (operation == "Add") {
    //                 let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                 if (userDetails.chips >= chips) {
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: -chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User._id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: userDetails.role,
    //                         providerId: User.id,
    //                         providerRole: User.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + User.username,
    //                         remark: 'Transaction To ' + User.username,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(userDetails.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + userDetails.email,
    //                         remark: 'Received From ' + userDetails.email,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(User.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:userDetails.name,
    //                         to:User.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"credit",
    //                         transactionId:'CR-' + traNumber
    //                     })
    //                     req.flash('success', 'Chips Added Successfully')
    //                     res.redirect('/master');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient admin chips.');
    //                     res.redirect('/master');
    //                     return;
    //                 }
    //             } else if (operation == 'Deduct') {
    //                 if (User.chips >= chips) {
    //                     let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User.id }, { $inc: { chips: -chips } });
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: User.role,
    //                         providerId: User.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + User.username,
    //                         remark: 'Received From ' + User.username,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(userDetails.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + userDetails.email,
    //                         remark: 'Transaction To ' + userDetails.email,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(User.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         category: 'debit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:User.name,
    //                         to:userDetails.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"debit",
    //                         transactionId:'DE-' + traNumber
    //                     })
    //                     req.flash('success', 'Chips Deduct Successfully')
    //                     res.redirect('/master');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient User chips.');
    //                     res.redirect('/master');
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addDeductChipsAgentOfMaster: async function(req, res) {
    //     try {
    //         let operation = req.body.chipsValue;
    //         let chips = req.body.chips;
    //         chips = Number(chips);
    //         if (chips <= 0){
    //             req.flash('error', 'Please enter valid chips.');
    //             res.redirect('/agentPlayerList/'+req.params.id);
    //         }else{
    //         let chipNote = req.body.chipsNote
    //         console.log(req.body.userId)
    //         let User = await Sys.App.Services.UserServices.getOneByData({ _id: req.body.userId })
    //         if (User) {
    //             if (operation == "Add") {
    //                 let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                 if (userDetails.chips >= chips) {
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: -chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User._id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: userDetails.role,
    //                         providerId: User.id,
    //                         providerRole: User.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + User.username,
    //                         remark: 'Transaction To ' + User.username,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(userDetails.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + userDetails.email,
    //                         remark: 'Received From ' + userDetails.email,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(User.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:userDetails.name,
    //                         to:User.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"credit",
    //                         transactionId:'CR-' + traNumber
    //                     })
    //                     req.flash('success', 'Chips Added Successfully')
    //                     res.redirect('/agentPlayerList/'+req.params.id);
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient admin chips.');
    //                     res.redirect('/agentPlayerList/'+req.params.id);
    //                     return;
    //                 }
    //             } else if (operation == 'Deduct') {
    //                 if (User.chips >= chips) {
    //                     let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User.id }, { $inc: { chips: -chips } });
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: User.role,
    //                         providerId: User.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + User.username,
    //                         remark: 'Received From ' + User.username,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(userDetails.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + userDetails.email,
    //                         remark: 'Transaction To ' + userDetails.email,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(User.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         category: 'debit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:User.name,
    //                         to:userDetails.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"debit",
    //                         transactionId:'DE-' + traNumber
    //                     })
    //                     req.flash('success', 'Chips Deduct Successfully')
    //                     res.redirect('/agentPlayerList/'+req.params.id);
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient User chips.');
    //                     res.redirect('/agentPlayerList/'+req.params.id);
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editMaster: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id });
    //         let userData = await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id});
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:'master'})
    //         console.log(commissionRange);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             user: user,
    //             masterActive: 'active',
    //             commissionRange:commissionRange,
    //             userData: userData[0].commission
    //         };
    //         return res.render('grandMaster/addMaster', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editMasterPostData: async function(req, res) {
    //     try {
    //         let grandMasterData = await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id });
    //         let player = await Sys.App.Services.UserServices.getUserData({ _id: req.params.id });
    //         let userNameData = await Sys.App.Services.UserServices.getUserData({ name:req.body.username });
    //         let masterDownLine =  await Sys.App.Services.UserServices.getUserData({ userId: player[0]._id });
    //         console.log("editMasterPostData masterDownLine",masterDownLine);
    //         console.log("editMasterPostData masterDownLine",player);
    //         let masterTotalCommission = req.body.commission * grandMasterData[0].commission / 100
    //       if(userNameData.length == 0 || req.params.id == userNameData[0]._id){
    //         if (player && player.length > 0) {
    //             if(masterDownLine.length){
    //                 for(let master=0;master<masterDownLine.length;master++){
    //                     let agentTotalCommission = masterTotalCommission * masterDownLine[master].totalCommission / 100
    //                     await Sys.App.Services.UserServices.updateUserData({
    //                         _id: masterDownLine[master]._id
    //                     }, {
    //                         commission: agentTotalCommission,
    //                     })
    //                 }
    //             }

    //             await Sys.App.Services.UserServices.updateUserData({
    //                 _id: req.params.id
    //             }, {
    //                 name: req.body.username,
    //                 status: req.body.status,
    //                 userId: req.session.details.id,
    //                 referralCode: req.body.referralCode,
    //                 totalCommission: req.body.commission,
    //                 commission: masterTotalCommission,
    //                 mobile: req.body.mobile,
    //             })
    //             req.flash('success', 'User update successfully');
    //             res.redirect('/master');

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('/');
    //             return;
    //         }
    //     }
    //     else{
    //             req.flash('error', 'User already present');
    //             res.redirect('/master');
    //             return;
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // agentEdit: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.UserServices.getOneByData({ _id: req.params.id });
    //         let userData = await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id});
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:player.role})
    //         console.log("player", userData);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             masterActive: 'active',
    //             player: player,
    //             userData:userData[0].commission,
    //             commissionRange:commissionRange
    //         };
    //         return res.render('grandMaster/agentEdit', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // agentEditPost: async function(req, res) {
    //     try {
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ _id: req.params.id })
    //         let grandMasterData = await Sys.App.Services.UserServices.getUserData({ _id:userData.userId});
    //         let userNameData = await Sys.App.Services.UserServices.getOneByData({name:req.body.username})
    //         console.log("userNameData",userNameData._id);
    //         if(userNameData.length == 0 || req.params.id == userNameData._id){
    //           if (userData) {
    //             let agentTotalCommission = req.body.commission * grandMasterData[0].commission / 100
    //             await Sys.App.Services.UserServices.updateUserData({
    //                 _id: req.params.id
    //             }, {
    //                 name: req.body.username,
    //                 mobile: Number(req.body.mobile),
    //                 totalCommission: req.body.commission,
    //                 commission: agentTotalCommission,
    //                 referralCode: req.body.referralCode,
    //                 status: req.body.status
    //             })
    //             req.flash('success', 'User Updated Successfully');
    //             res.redirect('/agentPlayerList/' + userData.userId);

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('/agentPlayerList/' + userData.userId);
    //             return;
    //         }
    //     }
    //         else{
    //                 req.flash('error', 'User already present');
    //                 res.redirect('/agentPlayerList/' + userData.userId);
    //                 return;
    //         }
    //         // req.flash('sucess', 'Player Registered successfully');
    //         // res.redirect('/');
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // agentPlayerListPost: async function(req, res) {
    //     try {
    //         console.log("yess", req.body);
    //         let start = parseInt(req.body.start);
    //         let length = parseInt(req.body.length);
    //         let search = req.body.search.value;
    //         let query = { user: req.body.id,isGuestPlayer:false }
    //         console.log(query);
    //         if (search != '') {
    //             query = { email: { $regex: '.*' + search + '.*' }, user: req.body.id,isGuestPlayer:false };
    //         }
    //         let data = await Sys.App.Services.PlayerServices.getByData(query, length, start);
    //         console.log("data", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // agentPlayerEdit: async function(req, res) {
    //     try {
    //         console.log("yessssss");
    //         let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({ _id: req.params.id });
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             playerActive: 'active',
    //             player: player
    //         };
    //         return res.render('grandMaster/agentPlayerEdit', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // agentPlayerEditPost: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.PlayerServices.getPlayerData({ _id: req.params.id });
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ _id: player[0].user })
    //         console.log(userData);
    //         if (player && player.length > 0) {
    //             await Sys.App.Services.PlayerServices.updatePlayerData({
    //                 _id: req.params.id
    //             }, {
    //                 username: req.body.username,
    //                 email: req.body.email,
    //             })
    //             req.flash('success', 'Player update successfully');
    //             res.redirect('/agentPlayerList/' + userData.userId);

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('/agentPlayerList/' + userData.userId);
    //             return;
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // playerEditOfAgent: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({ _id: req.params.id });
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ _id: player.user })
    //         console.log("maulik",userData);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             loginId: userData._id,
    //             playerActive: 'active',
    //             player: player
    //         };
    //         return res.render('player/agentPlayerEdit', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // playerEditOfAgentPost: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.PlayerServices.getPlayerData({ _id: req.params.id });
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ userId: req.session.details.id})
    //         let playerName = await Sys.App.Services.PlayerServices.getPlayerData({ username: req.body.username });
    //         let playerEmail = await Sys.App.Services.PlayerServices.getPlayerData({ email: req.body.email });
    //         console.log(userData);
    //     if(playerEmail.length > 0 && playerEmail[0]._id == req.params.id && playerName.length == 0){
    //         if(player.length > 0){
    //                     await Sys.App.Services.PlayerServices.updatePlayerData({
    //                         _id: req.params.id
    //                     }, {
    //                         username: req.body.username,
    //                         email: req.body.email,
    //                     })
    //                     req.flash('success', 'Player update successfully');
    //                     res.redirect('/agentPlayerList/' + userData._id);

    //                 } else {
    //                     req.flash('error', 'No User found');
    //                     res.redirect('/agentPlayerList/' + userData._id);
    //                     return;
    //                 }
    //     }
    //     else  if(playerName.length > 0 && playerName[0]._id == req.params.id && playerEmail.length == 0){
    //         if(player.length > 0){
    //             await Sys.App.Services.PlayerServices.updatePlayerData({
    //                 _id: req.params.id
    //             }, {
    //                 username: req.body.username,
    //                 email: req.body.email,
    //             })
    //             req.flash('success', 'Player update successfully');
    //             res.redirect('/agentPlayerList/' + userData._id);

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('/agentPlayerList/' + userData._id);
    //             return;
    //         }
    //     }
    //     else if(playerName.length == 0 && playerEmail.length == 0 ){
    //         if(player.length > 0){
    //             await Sys.App.Services.PlayerServices.updatePlayerData({
    //                 _id: req.params.id
    //             }, {
    //                 username: req.body.username,
    //                 email: req.body.email,
    //             })
    //             req.flash('success', 'Player update successfully');
    //             res.redirect('/agentPlayerList/' + userData._id);

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('/agentPlayerList/' + userData._id);
    //             return;
    //         }
    //     }
    //     else{
    //         req.flash('error', 'Player already present');
    //         res.redirect('/agentPlayerList/' + userData._id);
    //         return;  
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // masterAgent: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getUserData({_id:req.session.details.id});
    //         let roleData = await Sys.App.Services.UserServices.getRole({ name: req.session.details.name })
    //         console.log("roleData", roleData);
    //         var roleApprove

    //         console.log('11111');
    //         if (roleData == null) {
    //             console.log('22222');

    //             roleApprove = ""
    //         } else {
    //             console.log('33333');

    //             roleApprove = roleData.permission['Agent Management']
    //         }

    //         req.session.details.chips = parseFloat(user[0].chips).toFixed(2)
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             agentActive: 'active',
    //             name:user[0].name,
    //             roleData: (req.session.details.role == 'admin') ? "" : roleApprove
    //         };
    //         return res.render('grandMaster/masterAgent', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // getMasterAgent: async function(req, res) {
    //     try {
    //         console.log("yessss");
    //         let start = parseInt(req.query.start);
    //         let length = parseInt(req.query.length);
    //         let search = req.query.search.value;

    //         let query = { userId: req.session.details.id, role: 'agent' }
    //         console.log(query);
    //         if (search != '') {
    //             query = { name: { $regex: '.*' + search + '.*' }, userId: req.session.details.id, role: 'agent' };
    //         }

    //         let playersC = await Sys.App.Services.UserServices.getUserData(query);
    //         let playersCount = playersC.length;
    //         let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);
    //         console.log("data", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'recordsTotal': playersCount,
    //             'recordsFiltered': playersCount,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addMasterAgent: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id });
    //         let referralCodeGenerator = require('referral-code-generator')
    //         let code = referralCodeGenerator.alphaNumeric('uppercase', 2, 2)
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:'agent'})
    //         console.log(commissionRange);
    //         console.log("referralCodeGenerator", referralCodeGenerator.alphaNumeric('uppercase', 2, 2));
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             masterActive: 'active',
    //             referral: code,
    //             commissionRange:commissionRange,
    //             userData: user[0].commission
    //         };
    //         return res.render('grandMaster/addMasterAgent', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addMasterAgentPostData: async function(req, res) {
    //     try {
    //         let masterData = await Sys.App.Services.UserServices.getUserData({_id:req.session.details.id});
    //         let player = await Sys.App.Services.UserServices.getUserData({ email: req.body.email });
    //         let playerUsername = await Sys.App.Services.UserServices.getUserData({ name:req.body.username})
    //         if (player && player.length > 0 || playerUsername && playerUsername.length > 0) {
    //             req.flash('error', 'User Already Present');
    //             res.redirect('/masterAgent');
    //             return;
    //         } else {
    //             let player = await Sys.App.Services.UserServices.getUserCount({ referralCode: req.body.referralCode });
    //             if (player) {
    //                 req.flash('error', 'Referral Code Already Present');
    //                 res.redirect('/masterAgent');
    //                 return;
    //             }
    //             let agentTotalCommission = masterData[0].commission * req.body.commission / 100
    //             await Sys.App.Services.UserServices.insertUserData({
    //                 name: req.body.username,
    //                 email: req.body.email,
    //                 status: req.body.status,
    //                 password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
    //                 role: 'agent',
    //                 userId: req.session.details.id,
    //                 referralCode: req.body.referralCode,
    //                 totalCommission: req.body.commission,
    //                 commission: agentTotalCommission,
    //                 mobile: req.body.mobile,
    //             })
    //             req.flash('success', 'User create successfully');
    //             res.redirect('/masterAgent');
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editMasterAgent: async function(req, res) {
    //     try {
    //         let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.params.id });
    //         let userData = await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id });
    //         let commissionRange = await Sys.App.Services.UserServices.getCommissionRange({role:'agent'})
    //         console.log(commissionRange);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             user: user,
    //             agentActive: 'active',
    //             commissionRange:commissionRange,
    //             userData: userData[0].commission
    //         };
    //         return res.render('grandMaster/addMasterAgent', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // editMasterAgentPostData: async function(req, res) {
    //     try {
    //         let masterData = await Sys.App.Services.UserServices.getUserData({ _id: req.session.details.id });
    //         let player = await Sys.App.Services.UserServices.getUserData({ _id: req.params.id });
    //         let userdata = await Sys.App.Services.UserServices.getUserData({ name: req.body.username });
    //        if(userdata.length == 0 || req.params.id == userdata[0]._id){
    //         if (player && player.length > 0) {

    //             let agentTotalCommission = req.body.commission * masterData[0].commission / 100
    //             await Sys.App.Services.UserServices.updateUserData({
    //                 _id: req.params.id
    //             }, {
    //                 name: req.body.username,
    //                 status: req.body.status,
    //                 userId: req.session.details.id,
    //                 referralCode: req.body.referralCode,
    //                 totalCommission: req.body.commission,
    //                 commission: agentTotalCommission,
    //                 mobile: req.body.mobile,
    //             })
    //             req.flash('success', 'User update successfully');
    //             res.redirect('/masterAgent');

    //         } else {
    //             req.flash('error', 'No User found');
    //             res.redirect('/');
    //             return;
    //         }
    //     }
    //     else{
    //             req.flash('error', 'User already present');
    //             res.redirect('/masterAgent');
    //             return;
    //     }

    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // addDeductChipsMasterAgent: async function(req, res) {
    //     try {
    //         let operation = req.body.chipsValue;
    //         let chips = req.body.chips;
    //         chips = Number(chips);
    //         if (chips <= 0){
    //             req.flash('error', 'Please enter valid chips.');
    //             res.redirect('/masterAgent');
    //         }else{
    //         let chipNote = req.body.chipsNote
    //         console.log(req.body.userId)
    //         let User = await Sys.App.Services.UserServices.getOneByData({ _id: req.body.userId })
    //         if (User) {
    //             if (operation == "Add") {
    //                 let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                 if (userDetails.chips >= chips) {
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: -chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User._id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: userDetails.role,
    //                         providerId: User.id,
    //                         providerRole: User.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + User.username,
    //                         remark: 'Transaction To ' + User.username,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(userDetails.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + userDetails.email,
    //                         remark: 'Received From ' + userDetails.email,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(User.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:userDetails.name,
    //                         to:User.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"credit",
    //                         transactionId:'CR-' + traNumber
    //                     })
    //                     req.flash('success', 'Chips Added Successfully')
    //                     res.redirect('/masterAgent');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient admin chips.');
    //                     res.redirect('/masterAgent');
    //                     return;
    //                 }
    //             } else if (operation == 'Deduct') {
    //                 if (User.chips >= chips) {
    //                     let userDetails = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: userDetails.id }, { $inc: { chips: chips } });
    //                     await Sys.App.Services.UserServices.updateUserData({ _id: User.id }, { $inc: { chips: -chips } });
    //                     let traNumber = +new Date()
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: userDetails.id,
    //                         receiverRole: User.role,
    //                         providerId: User.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: User.username,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Received From ' + User.username,
    //                         remark: 'Received From ' + User.username,
    //                         transactionNumber: 'DEP-' + traNumber,
    //                         beforeBalance: eval(parseFloat(userDetails.chips).toFixed(2)),
    //                         afterBalance: parseFloat(parseFloat(userDetails.chips) + parseFloat(chips)).toFixed(2),
    //                         type: 'deposit',
    //                         category: 'credit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.AllUsersTransactionHistoryServices.insertData({
    //                         receiverId: User.id,
    //                         receiverRole: User.role,
    //                         providerId: userDetails.id,
    //                         providerRole: userDetails.role,
    //                         providerEmail: userDetails.email,
    //                         chips: parseFloat(parseFloat(chips).toFixed(2)),
    //                         message: 'Transaction To ' + userDetails.email,
    //                         remark: 'Transaction To ' + userDetails.email,
    //                         transactionNumber: 'DE-' + traNumber,
    //                         beforeBalance: eval(parseFloat(User.chips).toFixed(2)),
    //                         afterBalance: eval(parseFloat(User.chips).toFixed(2) - parseFloat(chips).toFixed(2)),
    //                         type: 'deduct',
    //                         category: 'debit',
    //                         status: 'success',
    //                         chipNote: chipNote
    //                     });
    //                     await Sys.App.Services.ChipsHistoryServices.insertChipsData({
    //                         from:User.name,
    //                         to:userDetails.name,
    //                         chips:chips,
    //                         reason:chipNote,
    //                         status:"debit",
    //                         transactionId:'DE-' + traNumber
    //                     })
    //                     req.flash('success', 'Chips Deduct Successfully')
    //                     res.redirect('/masterAgent');
    //                     return;
    //                 } else {
    //                     req.flash('error', 'Insufficient User chips.');
    //                     res.redirect('/masterAgent');
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // playerListOfAgent: async function(req, res) {
    //     try {
    //         console.log(req.session.details.id);
    //         let grandMasterData = await Sys.App.Services.UserServices.getUserDatatable({ _id: req.params.id })
    //         let grandMaster = await Sys.App.Services.UserServices.getUserDatatable({ _id: grandMasterData[0].userId })
    //         console.log("grandMasterData",grandMasterData);

    //         req.session.details.chips = parseFloat(grandMaster[0].chips).toFixed(2)
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             agentActive: 'active',
    //             id: req.params.id,
    //             name: grandMasterData[0].name
    //         };
    //         return res.render('grandMaster/playerListOfAgent', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // playerListOfAgentGet: async function(req, res) {
    //     try {
    //         console.log("call", req.body);
    //         console.log("maulik");
    //         let start = parseInt(req.body.start);
    //         let search = req.body.search.value;
    //         let query = { user: req.body.id }
    //         console.log(query);
    //         if (search != '') {
    //             query = { email: { $regex: '.*' + search + '.*' }, user: req.body.id };
    //         }
    //         let data = await Sys.App.Services.PlayerServices.getPlayerDatatable(query, start);
    //         console.log("data", data);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // AgentPlayerEdit: async function(req, res) {
    //     try {
    //         let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({ _id: req.params.id });
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ _id: player.user })
    //         console.log(userData);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             loginId: userData._id,
    //             playerActive: 'active',
    //                             player: player
    //         };
    //         return res.render('player/playerEditOfAgent', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // AgentPlayerEditPost: async function(req, res) {
    //     try {
    //         console.log("maulik callllll");
    //         let player = await Sys.App.Services.PlayerServices.getPlayerData({ _id: req.params.id });
    //         let userData = await Sys.App.Services.UserServices.getOneByData({ userId: req.session.details.id })
    //         let playerName = await Sys.App.Services.PlayerServices.getPlayerData({ username: req.body.username })
    //         let playerEmail = await Sys.App.Services.PlayerServices.getPlayerData({ email: req.body.email })
    //         console.log(userData);

    //         if (playerEmail.length > 0 && playerEmail[0]._id == req.body.id && playerName.length == 0 ) {
    //             if (player && player.length > 0) {

    //                 await Sys.App.Services.PlayerServices.updatePlayerData({
    //                     _id: req.params.id
    //                 }, {
    //                     username: req.body.username,
    //                     email: req.body.email,
    //                 })
    //                 req.flash('success', 'Player update successfully');
    //                 res.redirect('/playerListOfAgent/' + userData._id);

    //             } else {
    //                 req.flash('error', 'No User found');
    //                 res.redirect('/playerListOfAgent/' + userData._id);
    //                 return;
    //             }
    //         }
    //         else if (playerName.length > 0 && playerName[0]._id == req.body.id && playerEmail.length == 0) {
    //             if (player && player.length > 0) {

    //                 await Sys.App.Services.PlayerServices.updatePlayerData({
    //                     _id: req.params.id
    //                 }, {
    //                     username: req.body.username,
    //                     email: req.body.email,
    //                 })
    //                 req.flash('success', 'Player update successfully');
    //                 res.redirect('/playerListOfAgent/' + userData._id);

    //             } else {
    //                 req.flash('error', 'No User found');
    //                 res.redirect('/playerListOfAgent/' + userData._id);
    //                 return;
    //             }
    //         }
    //         else if (playerName.length == 0 && playerEmail.length == 0) {
    //             if (player && player.length > 0) {

    //                 await Sys.App.Services.PlayerServices.updatePlayerData({
    //                     _id: req.params.id
    //                 }, {
    //                     username: req.body.username,
    //                     email: req.body.email,
    //                 })
    //                 req.flash('success', 'Player update successfully');
    //                 res.redirect('/playerListOfAgent/' + userData._id);

    //             }  else {
    //                 req.flash('error', 'No User found');
    //                 res.redirect('/playerListOfAgent/' + userData._id);
    //                 return;
    //             }
    //         }
    //         else {
    //             req.flash('error', 'Player already present');
    //             res.redirect('/playerListOfAgent/' + userData._id);
    //             return;
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // supportCms: async function(req, res) {
    //     try {
    //         console.log("req.body", req.body);
    //         var data = {
    //             App: Sys.Config.App.details,
    //             error: req.flash("error"),
    //             success: req.flash("success"),
    //             role: req.session.details.role,
    //             cmsPage: 'active',
    //         };
    //         return res.render('cms/supportCms', data);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // },
    // getSupportCms: async function(req, res) {
    //     try {
    //         let start = parseInt(req.query.start);
    //         let length = parseInt(req.query.length);
    //         let search = req.query.search.value;
    //         console.log("start", start);
    //         console.log("length", length);
    //         let query = {}
    //         if (search != '') {
    //             query = { email: { $regex: '.*' + search + '.*' } };
    //         }


    //         let Count = await Sys.App.Services.CmsServices.supportCount(query);
    //         console.log(Count);
    //         let data = await Sys.App.Services.CmsServices.supportFindAll(query,start,length);
    //         var obj = {
    //             'draw': req.query.draw,
    //             'recordsTotal': Count,
    //             'recordsFiltered': Count,
    //             'data': data
    //         };
    //         res.send(obj);
    //     } catch (e) {
    //         console.log("Error", e);
    //     }
    // }
}
function isBcryptHash(value) {
    // Regular expression to match bcrypt hashes
    const bcryptHashRegex = /^\$2[aby]\$.{56}$/;
    return bcryptHashRegex.test(value);
}
