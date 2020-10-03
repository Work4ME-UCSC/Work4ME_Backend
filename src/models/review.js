const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserReview = new Schema({
    ReviewByWhom: {
        type: String
    },

    ReviewToWhom: {
        type: String
    },

    ReviewContent: {
        type: String
    },

    ReviewScore: {
        type: Date
    },
    
    ReviewDate: {
        type: Date
    }
},{
    collection: 'UserReview'
});

module.exports = mongoose.model('UserReview', UserReview);