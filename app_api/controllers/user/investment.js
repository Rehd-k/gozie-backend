const mongoose = require('mongoose');
const investment = mongoose.model('investment')
const withdrawal = mongoose.model('withdraw')
const { nanoid } = require('nanoid')
const nodemailer = require('nodemailer');




const craete_investment = (req, res, next) => {
    
    investment.create({
        _id: new mongoose.Types.ObjectId(),
        user: req.payload._id,
        email: req.payload.email,
        name: req.payload.firstName,
        increament: req.body.increament,
        interval: 'days',
        investmentId: nanoid(),
        paymentId: nanoid(),
        packageType: req.body.packageType,
        type: req.body.type,
        amount: req.body.amount
    },
        (err, result) => {
            if (err) {
                res
                    .json({
                        message: err.message
                    })
            } else {
                res
                    .status(201)
                    .json(result)
                
            }
        })
}

/**
 * 
 */

const get_user_invesments = (req, res, next) => {
    const user = req.payload.email
    investment.find({
        email: user
    })
        .exec((err, iterm) => {
            if (!iterm) {
                res.status(404).json({
                    message: "Investment not Found",
                });
                return;
            } else if (err) {
                res
                    .status(404)
                    .json(err);
                return;
            }
            res
                .status(200)
                .json(iterm);
        });
}



const update_investment = (req, res, next) => {
    console.log(req.body)
    investment.findById(req.params.investmentId).exec((err, iterm) => {
        if (!iterm) {
            res.status(404).json({
                message: "Account not found",
            });
            return;
        }
        if (req.body.confirmation) {
            (iterm.confirmation = req.body.confirmation)
        }
        if (req.body.currentAmount) {
            (iterm.currentBalance = req.body.currentAmount)
        }
        if (req.body.walletAddress) {
            (iterm.wallet = req.body.walletAddress)
        }
        if (req.body.partWithdrawal) {
            (iterm.partWithdrawal = iterm.partWithdrawal += req.body.partWithdrawal)
        }
        iterm.save((err, iterm) => {
            if (err) {
                res.status(404).json(err);
            } else {
                res.status(200).json(iterm);
            }
        });
    });
}

const get_user_withdrwals = (req, res, next) => {
    const user = req.payload.email
    investment.find({
        email: user,
        confirmation: 'withdraw'
    })
        .exec((err, iterm) => {
            if (!iterm) {
                res.status(404).json({
                    message: "Investment not Found",
                });
                return;
            } else if (err) {
                res
                    .status(404)
                    .json(err);
                return;
            }
            res
                .status(200)
                .json(iterm);
        });
}




const get_user_part_withdrwals = (req, res, next) => {
    const user = req.payload._id
    withdrawal.find({
        user: user
    })
        .exec((err, iterm) => {
            if (!iterm) {
                res.status(404).json({
                    message: "item not Found",
                });
                return;
            } else if (err) {
                res
                    .status(404)
                    .json(err);
                return;
            }
            res
                .status(200)
                .json(iterm);
        });
}



const delete_part_withdrawal = (req, res, next) => {
    const investmentid = req.params.id;
    if (investmentid) {
        withdrawal.findByIdAndRemove(investmentid).exec((err) => {
            if (err) {
                res
                    .status(404)
                    .json(err);
                return;
            }
            res
                .status(201)
                .json({
                    message: "Successful"
                });
        });
    } else {
        res.status(404).json({
            message: "No Investments",
        });
    }
}


const delete_investment = (req, res, next) => {
    const investmentid = req.params.investmentId;
    if (investmentid) {
        withdrawal.findByIdAndRemove(investmentid).exec((err) => {
            if (err) {
                res
                    .status(404)
                    .json(err);
                return;
            }
            res
                .status(201)
                .json({
                    message: "Deleted"
                });
        });
    } else {
        res.status(404).json({
            message: "No Investments",
        });
    }
}

const withdraw = (req, res, next) => {
    withdrawal.create({
        _id: new mongoose.Types.ObjectId(),
        user: req.payload._id,
        investmentId: req.body.investmentId,
        amount: req.body.amount,
        wallet: req.body.wallet,
        name: req.payload.firstName,
        email: req.payload.email,
        confirmation: req.body.confirmation
    },
        (err, result) => {
            if (err) {
                res
                    .json({
                        message: err.message
                    })
            } else {
                res
                    .status(201)
                    .json(result)
                let info = {
                    body: result,
                    activity: 'Just made a withdrawal'
                }
            }
        })
}

const getwithdraw = (req, res, next) => {
    withdrawal.find()
        .exec((err, result) => {
            if (err) {
                res
                    .json({
                        message: err.message
                    })
            } else {
                res
                    .status(201)
                    .json(result)
            }
        })
}




module.exports = {
    craete_investment,
    get_user_invesments,
    get_user_withdrwals,
    update_investment,
    delete_investment,
    withdraw,
    getwithdraw,
    get_user_part_withdrwals,
    delete_part_withdrawal

}