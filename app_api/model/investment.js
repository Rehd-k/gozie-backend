const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const investment = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    interval: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    packageType: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    increament: {
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
    withdarwable : {
        type : Boolean,
        default: false
    },
    wallet: {
        type: String,
        default: 'pending'
    },
    partWithdrawal: {
        type: Number,
        default: 0
    },

})

module.exports = mongoose.model('investment', investment)