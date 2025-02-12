const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DailyWheelDataSchema = new Schema(
  {
    dailyWheelData: {
      type: Map,
      of: String,
      required: true,
    },
  },
  {
    collection: 'dailyWheelData',
    timestamps: true,
    versionKey: false,
  }
);

DailyWheelDataSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('DailyWheelData', DailyWheelDataSchema);
