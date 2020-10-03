const express = require('express');
const UserReviewRoutes = express.Router();

let UserReview = require('./review');


UserReviewRoutes.route('/addReview').post(function(req, res){

    let userReview = new UserReview(req.body);
    userReview.save()
    .then(userReview=> {
        res.status(200).json({ 'UserReview': 'Review added successfully' });
      })
      .catch(err => {
        res.status(400).send("unable to save to database");
      });
});

//retrieve a review for the user profile
UserReviewRoutes.route('/retrieveReview').post(function (req,res){
   
    var userID = req.body.id;
  
    UserReview.findOne({ReviewToWhom: userID})
      .then(response=>{
          res.status(200).send({
            reviewBody: response
         })
  
         console.log("Successfully retrieved");
      })
  
      .catch(err=>{
          console.log("Error while retrieving review");
      })
  }) 

