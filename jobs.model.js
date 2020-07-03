const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Jobs = new Schema({

    JobID:{
        type:String
    },

    JobTitle:{
        type:String
    },

    JobCategory:{
        type:String
    }

    // JobDescribtion:{
    //     type:String
    // },

    // JobDetails:{
    //     type:String
    // },

    // JobSalary:{
    //     type:String
    // },

    // JobDate:{
    //     type:String
    // },

    // JobTime:{
    //     type:String
    // },

    // JobAddress:{
    //     type:String
    // },

    // JobLocation:{
    //     type:String
    // }
},{
    collection : 'Jobs'
});

module.exports = mongoose.model('Jobs', Jobs);