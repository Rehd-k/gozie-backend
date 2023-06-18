const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const investmentSettings = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    InvestmentType: {
        type: String,
        //Agro, RealEsate, Crypto
    },
    packageTypes: {
        type: String,
        //standard, business , executive
    },
    percentages: {
        type: Number,
    },
    duration: {
        type: String,
        //daily weekly monthly yearly 
    },
    minValue: {
        type: Number,
    },
    maxValue: {
        type: Number,
    },
    refBonus: {
        type: Number
    }
})

module.exports = mongoose.model('investmentSetting', investmentSettings)