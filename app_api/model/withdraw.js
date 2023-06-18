const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const withdrawal = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    amount: {
        type: Number,
        required: true
    },
    investmentId: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    confirmation: {
        type: String,
        default: 'pending'
    },
    wallet: {
        type: String,
        default: 'pending'
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    confirmation: {
        type: String,
        default: 'pending'
    }

})

module.exports = mongoose.model('withdraw', withdrawal)