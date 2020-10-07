const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    //JobID
    jobDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Jobs",
    },

    //EmployeeID
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    //EmployerID
    employerID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    jobStatus: {
      type: String,
      required: true,
    },

    isEmployerReviewed: {
      type: Number,
      default: 0,
    },

    isEmployeeReviewed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EmployeeJobs", jobSchema);
