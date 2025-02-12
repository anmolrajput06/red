"use strict";

const mongoose = require("mongoose");

const DailyWheelDatamodel = mongoose.model("DailyWheelData");


module.exports = {
    createDailyWheel: async function (data) {
        console.log("createUser Data:", data);
        try {
            return await DailyWheelDatamodel.create(data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    updateDailyWheel: async function (condition, data) {
        try {
            return await DailyWheelDatamodel.updateOne(data);
        } catch (e) {
            console.error("Mongoose Validation Error:", e.message, e.errors);
        }
    }
,    

    findDailyWheel: async function () {
        try {
            return await DailyWheelDatamodel.find();
        } catch (e) {
            console.log("Error", e);
        }
    }

};
