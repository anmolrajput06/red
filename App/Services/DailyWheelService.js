"use strict";

const mongoose = require("mongoose");

const DailyWheelDatamodel = mongoose.model("DailyWheelData");


module.exports = {
    createDailywheel: async function (data) {
        console.log("createUser Data:", data);
        try {
            return await DailyWheelDatamodel.create(data);
        } catch (e) {
            console.log("Error", e);
        }
    },


};
