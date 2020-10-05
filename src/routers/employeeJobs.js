const express = require("express");

const Jobs = require("../models/jobs");
const EmployeeJobs = require("../models/employeeJobs");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/apply/:id", auth, async (req, res) => {
  let job = new EmployeeJobs({
    owner: req.user._id,
    jobStatus: "pending",
    jobID: req.params.id,
    jobDetails: req.params.id,
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
    const match = {};

    if (req.query.status) match.jobStatus = req.query.status;

    await req.user
      .populate({
        path: "appliedJobs",
        populate: { path: "jobDetails", populate: "owner" },
        match,
      })
      .execPopulate();

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

    const jobID = job.jobDetails;
    const mainJob = await Jobs.findById(jobID);

    mainJob.cancelJobRequest(req.user._id);
    res.send({ message: "Deleted successfully" });
  } catch (e) {
    res.status(401).send(e);
  }
});

router.patch("/jobFinished/:id", auth, async (req, res) => {
  try {
    const job = await EmployeeJobs.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    job.jobStatus = "finished";
    await job.save();

    const employee = await User.findById(req.user._id);
    employee.jobCompleted = employee.jobCompleted + 1;
    await employee.save();

    const employer = await User.findById(req.body.employerID);
    employer.jobCompleted = employer.jobCompleted + 1;
    await employer.save();

    res.status(201).send({ message: "Job finished" });
  } catch (e) {
    res.status(401).send(e);
  }
});

module.exports = router;
