const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;




const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    refererId: String,
    password: String,
    firstName: {
        type: String,
        required: "Please include your first name",
    },
    lastName: {
        type: String,
        required: "Please include your last Name",
    },
    email: {
        type: String,
        unique: "An account have already been registered with this email",
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        required: "Your email cannot be empty",
    },
    refCode: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    walletAddress: {
        type: String,
        // required: true
    },
    refBonus: {
        type: Number,
        default: 0
    },
    phoneNumber: {
        type: Number,
        required: true,
        default: 0
    },
    profilePicture: {
        url: String,
        public_id: String
    },
    bonus: {
        type: Number,
        default: 0
    },
    earnings: {
        type: Number,
        default: 0
    }
});



userSchema.methods.setPassword = function (password) {
    this.password = password
};

userSchema.methods.validPassword = function (password) {
    return this.password === password;
};

userSchema.methods.generateJWT = function () {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        firstName: this.firstName,
        exp: parseInt(expiry.getTime() / 1000, 10),
    },
        process.env.JWT_SECRET
    );
};
module.exports = mongoose.model("user", userSchema);