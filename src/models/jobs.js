const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Jobs = new Schema(
  {
    JobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    JobCategory: {
      type: String,
      required: true,
    },

    JobDescription: {
      type: String,
      required: true,
      trim: true,
    },

    JobDetails: {
      type: String,
    },

    JobSalary: {
      type: String,
    },

    JobDay: {
      type: String,
      required: true,
    },

    JobTime: {
      type: String,
    },

    JobAddress: {
      type: String,
      trim: true,
    },

    JobLocation: {
      type: String,
      required: true,
    },

    Sex: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Jobs",
  }
);

module.exports = mongoose.model("Jobs", Jobs);
