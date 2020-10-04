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

    //EmployerID
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    jobStatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EmployeeJobs", jobSchema);
