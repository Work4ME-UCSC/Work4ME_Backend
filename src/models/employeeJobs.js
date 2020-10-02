const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    jobID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Jobs",
    },

    jobDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Jobs",
    },

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
