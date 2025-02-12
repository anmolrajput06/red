var Sys = require('../../Boot/Sys');

const mongoose = require('mongoose');
const dailywheeldata = require('../Models/dailywheeldata');

module.exports = {
    updateDailyWheeldata: async function (req, res) {
        try {
            let dailyWheel = await Sys.App.Services.DailyWheelService.findDailyWheel()
            console.log("data", req.body, dailyWheel);
            if (dailyWheel == undefined || dailyWheel.dailyWheelData == undefined) {
                await Sys.App.Services.DailyWheelService.createDailyWheel({ dailyWheelData: req.body })
            } else {
                await Sys.App.Services.DailyWheelService.updateDailyWheel( { dailyWheelData: req.body })
            }
            return res.send({ status: 200, msg: "Setting data updated successfully." })
        } catch (e) {
            console.log("error", e);
        }
    },
}
