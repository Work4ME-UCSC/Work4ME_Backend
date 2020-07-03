const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;


const jobsRoute = require('./jobs.route');

//connecting database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/WORK4ME_APP', { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

//attaching the cors and body-parser middleware to express server
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/jobs', jobsRoute);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});