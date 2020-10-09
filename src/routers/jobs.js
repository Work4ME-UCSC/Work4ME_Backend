const express = require("express");

const Jobs = require("../models/jobs");
const EmployeeJobs = require("../models/employeeJobs");

const auth = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");

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
router.route('/countjobType').post(function (req,res){
  const jobTypeCount = [0,0,0];

  Jobs.find()
    .then(response=>{
      for (let i=0; i<response.length; i++){
        switch(response[i].JobCategory){
          case("Gardening"):
            jobTypeCount[0]++;
            break;

          case("Data Entry"):
            jobTypeCount[1]++;
            break;

          case("Delivery Boy"):
            jobTypeCount[2]++;
            break;
            
          // case("Teaching"):
          //   jobTypeCount[3]++;
          //   break;

          // case(""):
          //   jobTypeCount[4]++;
          //   break;

          // case(""):
          //   jobTypeCount[5]++;
          //   break;
        }
    }

    console.log(jobTypeCount);

    res.status(200).send({
      jobTypeCount: jobTypeCount
    })
  })
})

// app.get('/' ,(req,res) => {
//     res.send('<h1> Hello Ram </h1>')
// });

module.exports = router;
