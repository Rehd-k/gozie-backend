const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emails = new Schema({
    Header: {
        type: String,
    },
    body: {
        type: String
    },
    recipiants: [{
        email: String,
        firstName: String
    }],
    senderName: {
        type: String
    },
    subject: {
        type: String
    }
})

module.exports = mongoose.model('mail', emails)