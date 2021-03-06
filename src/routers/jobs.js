const express = require("express");

const Jobs = require("../models/jobs");
const EmployeeJobs = require("../models/employeeJobs");
const User = require("../models/user");
const auth = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");
const { sendJobConfirmEmail } = require("../emails/account");

const router = new express.Router();

//To create a job

router.post("/add", auth, async (req, res) => {
  let JobImage;

  try {
    if (req.body.JobImage) {
      const imgStr = req.body.JobImage;
      const uploadResponse = await cloudinary.uploader.upload(imgStr, {
        upload_preset: "job_images",
        folder: "job_images",
      });
      JobImage = uploadResponse.url;
    } else {
      JobImage = "";
    }
    const jobs = new Jobs({
      ...req.body,
      JobImage,
      owner: req.user._id,
      open: true,
    });

    const newJob = await jobs.save();

    res.status(201).json(newJob);
  } catch (e) {
    res.status(400).send(err);
  }
});

//Get all the jobs available

router.get("/alljobs", async (req, res) => {
  try {
    const jobs = await Jobs.find({ open: true }).populate({
      path: "owner",
    });
    res.send(jobs);
  } catch (e) {
    res.status(500).send();
  }
});

//Get the jobs posted by the current employer

router.get("/employer", auth, async (req, res) => {
  try {
    const jobs = await Jobs.find({ owner: req.user._id });
    res.send(jobs);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/selectedJobs", auth, async (req, res) => {
  try {
    const match = {};

    if (req.query.status) match.jobStatus = req.query.status;

    await req.user
      .populate({
        path: "pastJobs",
        populate: [{ path: "jobDetails" }, { path: "owner" }],
        match,
      })
      .execPopulate();

    res.send(req.user.pastJobs);
  } catch (e) {
    res.status(401).send(e);
  }
});

router.get("/requests", auth, async (req, res) => {
  try {
    const requests = await Jobs.find({
      owner: req.user._id,
      open: true,
    }).populate({ path: "applicants.applicantID" });
    res.send(requests);
  } catch (e) {
    res.status(500).send();
  }
});

// Confirm a job

router.patch("/confirm/:jobID/:userID", auth, async (req, res) => {
  try {
    const myJob = await Jobs.findById(req.params.jobID);
    myJob.applicants = [];
    myJob.open = false;
    await myJob.save();

    const jobName = myJob.JobTitle;
    const employee = await User.findById(req.params.userID);
    const email = employee.email;

    const employeeJob = await EmployeeJobs.findOne({
      owner: req.params.userID,
      jobDetails: req.params.jobID,
    });

    employeeJob.jobStatus = "confirmed";
    await employeeJob.save();

    // Delete other requests after confirmation

    await EmployeeJobs.deleteMany({
      jobDetails: req.params.jobID,
      jobStatus: "pending",
    });

    sendJobConfirmEmail(email, jobName);

    res.send({ message: "Job confrimed" });
  } catch (e) {
    res.status(401).send(e);
  }
});

// Reject a job request

router.delete("/reject/:jobID/:userID", auth, async (req, res) => {
  try {
    const jobID = req.params.jobID;
    const userID = req.params.userID;

    const job = await Jobs.findById(jobID);
    job.applicants = job.applicants.filter(
      (applicant) => applicant.applicantID.toString() !== userID.toString()
    );
    await job.save();

    await EmployeeJobs.findOneAndDelete({
      jobDetails: jobID,
      owner: userID,
    });

    res.status(201).send({ message: "Rejected successfully" });
  } catch (e) {
    res.status(401).send({ error: e });
  }
});

//Delete a particular job

router.delete("/job/:id", auth, async (req, res) => {
  try {
    const job = await Jobs.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    await EmployeeJobs.deleteMany({
      jobDetails: req.params.id,
      employerID: req.user._id,
    });

    if (!job) return res.status(404).send();

    res.send(job);
  } catch (e) {
    res.status(500).send();
  }
});

//get all jobs posted count
router.route("/jobsposted").get(function (req, res) {
  Jobs.find()
    .countDocuments()
    .then((response) => {
      res.status(200).send({
        jobsPosted: response,
      });
    });
});

//get all jobs completed count
router.route("/jobscompleted").get(function (req, res) {
  EmployeeJobs.find({ jobStatus: "finished" })
    .countDocuments()
    .then((response) => {
      res.status(200).send({
        jobsCompleted: response,
      });
    });
});

//count according to the job type
router.route("/countJobCategory").get(function (req, res) {
  const jobCategoryCount = [0, 0, 0, 0, 0];

  Jobs.find().then((response) => {
    for (let i = 0; i < response.length; i++) {
      //console.log("QQQQ",response[i].JobCategory)
      switch (response[i].JobCategory) {
        case "Household":
          jobCategoryCount[0]++;
          break;

        case "IT":
          jobCategoryCount[1]++;
          break;

        case "Driving":
          jobCategoryCount[2]++;
          break;

        case "Technician":
          jobCategoryCount[3]++;
          break;

        case "Education":
          jobCategoryCount[4]++;
          break;
      }
    }

    console.log(jobCategoryCount);

    res.status(200).send({
      jobCategoryCount: jobCategoryCount,
    });
  });
});

// app.get('/' ,(req,res) => {
//     res.send('<h1> Hello Ram </h1>')
// });

module.exports = router;
