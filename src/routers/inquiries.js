const express = require('express');
const inquiries = require('../models/inquiries');
const router = express.Router();

const Inquiries = require("../models/inquiries");

//count total complaints
router.route('/countInquiries').get(function (req,res){
  Inquiries.find().countDocuments()
    .then(response=>{
      res.status(200).send({
        inquiriesCount: response
      })
    })

    .catch(err=>{
      res.status(400).send({
        inquiriesCount: 0
      })
    })
})

//retrieve complaint data for admin purposes
router.route('/inquiriesDetails').get(function (req, res) {
    Inquiries.find(function(err, inquiries){
    if(err){
      console.log(err);
    }
    else {
      res.json(inquiries);
      console.log(inquiries);
    }
  });
  
});

module.exports = router;