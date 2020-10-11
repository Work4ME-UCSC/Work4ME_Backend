const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Inquiries = new Schema({
    complainantFName: {
        type: String
    },

    complainantLName: {
        type: String
    },

    userType: {
        type: String
    },

    complaint: {
        type: String
    },

    status: {
        type: Boolean
    },

    complainedDate: {
        type: Date
    }
},{
    collection: 'Inquiries'
});

module.exports = mongoose.model('Inquiries', Inquiries);