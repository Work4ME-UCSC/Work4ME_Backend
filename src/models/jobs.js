const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let jobSchema = new Schema(
  {
    JobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    JobDescription: {
      type: String,
      required: true,
      trim: true,
    },

    JobCategory: {
      type: String,
      required: true,
    },

    JobLocation: {
      type: String,
      required: true,
    },

    JobAddress: {
      type: String,
      trim: true,
    },

    JobSalary: {
      type: String,
    },

    JobDate: {
      type: String,
    },

    Sex: {
      type: String,
      required: true,
    },

    JobImage: {
      type: String,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    open: {
      type: Boolean,
      required: true,
    },

    applicants: [
      {
        applicantID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "Jobs",
  }
);

jobSchema.methods.applyForJob = async function (applicantID) {
  const job = this;

  job.applicants = job.applicants.concat({ applicantID });

  await job.save();
};

jobSchema.methods.cancelJobRequest = async function (applicantID) {
  const job = this;

  job.applicants = job.applicants.filter(
    (apply) => apply.applicantID.toString() !== applicantID.toString()
  );

  await job.save();
};

jobSchema.pre("save", function (next) {
  const job = this;

  for (const [key, value] of Object.entries(job._doc)) {
    if (value === null || value === "") {
      delete job._doc[key];
    }
  }

  next();
});

module.exports = mongoose.model("Jobs", jobSchema);
