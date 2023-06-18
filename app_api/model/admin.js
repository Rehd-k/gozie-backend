const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;




const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: {
        type: String,
        unique: "An account have already been registered with this username"
    },
    email: {
        type: String,
        unique: "An account have already been registered with this email",
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    hash: String,
    salt: String,
    createdOn: {
        type: Date,
        default: Date.now,
    },
    BtcAddress: {
        type: String,
        default: '1QDcVAtu621LbJUNKSUntQ41cMzYF1gAvy'
    }
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
};

userSchema.methods.validPassword = function (password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
    return this.hash === hash;
};

userSchema.methods.generateJWT = function () {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        firstName: this.userName,
        exp: parseInt(expiry.getTime() / 1000, 10),
    },
        process.env.JWT_SECRET
    );
};
module.exports = mongoose.model("admin", userSchema);