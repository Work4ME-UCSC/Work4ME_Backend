const express = require("express");
const router = new express.Router();

const UserReview = require("../models/review");
const auth = require("../middleware/auth");
const EmployeeJobs = require("../models/employeeJobs");
const User = require("../models/user");

router.post("/add", auth, async (req, res) => {
  const jobID = req.body.jobID;
  const userType = req.user.userType;

  try {
    const userReview = new UserReview({
      ReviewByWhom: req.user._id,
      ReviewToWhom: req.body.to,
      ReviewScore: req.body.rate,
      ReviewContent: req.body.review,
    });

    await userReview.save();

    const reviewBy =
      userType === "employer" ? "isEmployerReviewed" : "isEmployeeReviewed";

    const employeeJob = await EmployeeJobs.findOne({
      jobDetails: jobID,
    });

    employeeJob[reviewBy] = req.body.rate;
    await employeeJob.save();

    const reviewdUser = await User.findById(req.body.to);
    reviewdUser.rate = (
      (reviewdUser.rate * reviewdUser.reviewCount + req.body.rate) /
      (reviewdUser.reviewCount + 1)
    ).toFixed(1);

    reviewdUser.reviewCount = reviewdUser.reviewCount + 1;
    await reviewdUser.save();

    res.status(201).send({ message: "Review added successfully" });
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

router.get("/retrieve/:id", auth, async (req, res) => {
  try {
    const review = await UserReview.find({
      ReviewToWhom: req.params.id,
    }).populate({ path: "ReviewByWhom" });

    res.status(200).send({ review });
  } catch (e) {
    res.status(400).send({ error: e });
  }3
});

// retrieve all the reviews
router.get("/allreviews", async (req, res) => {
  UserReview.find()
    .populate(["ReviewByWhom", "ReviewToWhom"])
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status.send({ error: err }));
});


// /** 
// * @desc: Removes particular data from the collection upon deactivation
// */
// router.route('/deletereview/:id').post(function (req, res) {
//   console.log(req.body);
//   UserReview.deleteOne({_id: req.params.id })
//     .then(response=>{
//       console.log(res.body);
//       res.status(200).send({
//         success: true,
//         message: "Review removed"
//       })
//     })
// })

module.exports = router;
