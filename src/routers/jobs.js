const express = require("express");

let Jobs = require("../models/jobs");
const auth = require("../middleware/auth");

const JobsRoutes = new express.Router();

JobsRoutes.route("/add").post(function (req, res) {
  console.log(req.body);
  let jobs = new Jobs(req.body);
  jobs
    .save()
    .then((jobs) => {
      res.status(200).json(jobs);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

JobsRoutes.get("/alljobs", async (req, res) => {
  try {
    const jobs = await Jobs.find({});
    res.send(jobs);
  } catch (e) {
    res.status(500).send();
  }
});

// app.get('/' ,(req,res) => {
//     res.send('<h1> Hello Ram </h1>')
// });

module.exports = JobsRoutes;
