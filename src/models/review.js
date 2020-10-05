const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserReview = new Schema(
  {
    ReviewByWhom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ReviewToWhom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ReviewContent: {
      type: String,
    },

    ReviewScore: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "UserReview",
    timestamps: true,
  }
);

module.exports = mongoose.model("UserReview", UserReview);
