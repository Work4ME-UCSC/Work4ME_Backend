const express = require("express");

const Jobs = require("../models/jobs");
const EmployeeJobs = require("../models/employeeJobs");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/apply/:id", auth, async (req, res) => {
  let job = new EmployeeJobs({
    owner: req.user._id,
    jobStatus: "pending",
    jobID: req.params.id,
    jobTitle: req.body.jobTitle,
  });

  try {
    await job.save();

    const jobEmployer = await Jobs.findById(req.params.id);
    jobEmployer.applyForJob(req.user._id);
    res.status(201).send(job);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/apply", auth, async (req, res) => {
  try {
    //const appliedJobs = await EmployeeJobs.find({ owner: req.user._id });
    const match = {};

    if (req.query.status) match.jobStatus = req.query.status;

    await req.user.populate({ path: "appliedJobs", match }).execPopulate();

    res.send(req.user.appliedJobs);
  } catch (e) {
    res.status(401).send(e);
  }
});

router.delete("/cancelRequest/:id", auth, async (req, res) => {
  try {
    const job = await EmployeeJobs.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    const jobID = job.jobID;
    const mainJob = await Jobs.findById(jobID);

    mainJob.cancelJobRequest(req.user._id);
    res.send({ message: "Deleted successfully" });
  } catch (e) {
    res.status(401).send(e);
  }
});

// Delete other requests after confirmation

router.delete("/deleteRequests/:jobID", auth, async (req, res) => {
  try {
    await EmployeeJobs.deleteMany({
      jobID: req.params.jobID,
      jobStatus: "pending",
    });
    res.send({ message: "Deleted pending requests" });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
