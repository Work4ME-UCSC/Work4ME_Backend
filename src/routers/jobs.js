const express = require("express");
const JobsRoutes = express.Router();

let Jobs = require("../models/jobs");
// const jobs = require("../models/jobs");

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

JobsRoutes.route('/get').get(function(req, res){
  Jobs.find(function(err, jobs){
    if(err){
      console.log(err);
    }else{
      res.json(jobs);
    }
  })
})

// app.get('/' ,(req,res) => {
//     res.send('<h1> Hello Ram </h1>')
// });

module.exports = JobsRoutes;
