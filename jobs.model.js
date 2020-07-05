const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Jobs = new Schema(
  {
    // JobID: {
    //   type: String,
    // },

    JobTitle: {
      type: String,
    },

    JobCategory: {
      type: String,
    },

    JobDescribtion: {
      type: String,
    },

    JobDetails: {
      type: String,
    },

    JobSalary: {
      type: String,
    },

    JobDay: {
      type: String,
    },

    JobTime: {
      type: String,
    },

    JobAddress: {
      type: String,
    },

    JobLocation: {
      type: String,
    },

    Sex: {
      type: String,
    },
  },
  {
    collection: "Jobs",
  }
);

module.exports = mongoose.model("Jobs", Jobs);
