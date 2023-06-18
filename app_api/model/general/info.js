const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const paymentSettings = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    coinName: {
        type: String,
    },
    WalletAddress: {
        type: String,

    },
    Network: {
        type: String,
    }
})

module.exports = mongoose.model('paymentSetting', paymentSettings)