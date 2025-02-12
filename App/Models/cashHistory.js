const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CashSchema = new Schema(
  {
    from: {
      type: "string",
    },
    to: {
      type: "string",
    },
    type: {
      type: "string",
      default: "deposit",
    },
    userIdObject: {
      type: "object",
      default: {},
    },
    //   cash  :
    //   {
    //       type: 'number', default:'0'
    //   },
    customerName: {
      type: "string",
    },
    amount: {
      type: "number",
      default: "0",
    },

    status: {
      type: "string",
    },
    // user:{
    //   type: Schema.Types.ObjectId,
    //   ref: 'user'
    // },
    transactionId: {
      type: "string",
    },

    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "cashHistory", versionKey: false }
);

mongoose.model("cashHistory", CashSchema);
mongoose.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
