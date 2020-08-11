const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    jobID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Jobs",
    },

    // JobTitle: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },

    // JobCategory: {
    //   type: String,
    //   required: true,
    // },

    // JobDescription: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },

    // JobDay: {
    //   type: String,
    //   required: true,
    // },

    // JobAddress: {
    //   type: String,
    //   trim: true,
    // },

    // JobLocation: {
    //   type: String,
    //   required: true,
    // },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },

    jobStatus: {
      type: String,
      required: true,
    },

    // employer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "Users",
    // },
  },
  {
    timestamps: true,
  }
);

jobSchema.pre("save", function (next) {
  const job = this;

  for (const [key, value] of Object.entries(job._doc)) {
    if (value === null || value === "") {
      delete job._doc[key];
    }
  }

  next();
});

module.exports = mongoose.model("EmployeeJobs", jobSchema);
