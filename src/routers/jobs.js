const express = require("express");

let Jobs = require("../models/jobs");
const auth = require("../middleware/auth");

const router = new express.Router();

//To create a job

router.post("/add", auth, function (req, res) {
  let jobs = new Jobs({
    ...req.body,
    owner: req.user._id,
  });

  jobs
    .save()
    .then((jobs) => {
      res.status(201).json(jobs);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//Get all the jobs available

router.get("/alljobs", async (req, res) => {
  try {
    const jobs = await Jobs.find({});
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

// app.get('/' ,(req,res) => {
//     res.send('<h1> Hello Ram </h1>')
// });

module.exports = router;
