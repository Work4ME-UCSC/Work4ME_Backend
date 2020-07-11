const express = require("express");
const JobsRoutes = express.Router();

let Jobs = require("../models/jobs");

JobsRoutes.route("/add").post(function (req, res) {
  console.log(req.body);
  let jobs = new Jobs(req.body);
  jobs
    .save()
    .then((jobs) => {
      res.status(200).json({ jobs: "jobs added successfully" });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// app.get('/' ,(req,res) => {
//     res.send('<h1> Hello Ram </h1>')
// });

module.exports = JobsRoutes;
