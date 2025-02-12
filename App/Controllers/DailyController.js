var Sys = require('../../Boot/Sys');

const mongoose = require('mongoose');
const dailywheeldata = require('../Models/dailywheeldata');

module.exports = {
    dailywheeldata: async function (req, res) {
        try {
            let dailyWheelData = await Sys.App.Services.DailyWheelService.createDailywheel({
                
            })
           
            return res.render('customer/customer', data);
        } catch (e) {
            console.log("Error", e);
        }
    },
}
