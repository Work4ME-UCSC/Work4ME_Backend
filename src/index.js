const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT;

const app = express();

const jobsRoute = require("./routers/jobs");
const userRouter = require("./routers/user");
const employeeJobsRouter = require("./routers/employeeJobs");
const reviewRoute = require("./routers/review");
const inquiriesRoute = require("./routers/inquiries");

//connecting database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }).then(
  () => {
    console.log("Database is connected");
    console.log("Server is up on port " + PORT);
  },
  (err) => {
    console.log("Can not connect to the database" + err);
  }
);

//attaching the cors and body-parser middleware to express server
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/jobs", jobsRoute);
app.use("/users", userRouter);
app.use("/employee", employeeJobsRouter);
app.use("/review", reviewRoute);
app.use("/inquiries", inquiriesRoute);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
