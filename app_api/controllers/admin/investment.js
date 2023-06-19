const mongoose = require('mongoose');
const investments = mongoose.model('investment');
const withdrawal = mongoose.model('withdraw')
const User = mongoose.model('user')
const { nanoid } = require('nanoid')


/**
 * 
 Show All cryptoInvest
 */

const read_all_investemtns = (req, res, next) => {
    investments.find()
        .exec((err, result) => {
            if (err) {
                return res
                    .status(404)
                    .json(err)
            } else {
                return res
                    .status(200)
                    .json(result)
            }
        })
}


/**
 * Show user investment 
 */

// check this  route letter and know weather to change that userid to email
const read_user_investements = (req, res, next) => {
    investments.find({
        user: req.params.userId
    })
        .exec((err, results) => {
            if (err) {
                return res
                    .status(404)
                    .json(err)
            } else {
                return res
                    .status(200)
                    .json(results)
            }
        })
}







const update_investment = (req, res, next) => {
    console.log(req.body)
    investments.findById(req.params.investmentId).exec((err, iterm) => {
        if (!iterm) {
            res.status(404).json({
                message: "Account not found",
            });
            return;
        }

        if (req.body.amount) {
            (iterm.amount = req.body.amount)
        }

        if (req.body.withdarwable) {
            (iterm.withdarwable = req.body.withdarwable)
        }
        if (req.body.partWithdrawal) {
            (iterm.partWithdrawal = iterm.partWithdrawal += req.body.partWithdrawal)
        }

        if (req.body.confirmation) {
            (iterm.createdOn = Date.now()),
            (iterm.confirmation = req.body.confirmation)
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

/**
 * remove Crypto Assets
 */

const remove_user_investemt = (req, res, next) => {
    investments.findByIdAndRemove(req.params.investmentId)
        .exec((err, assets) => {
            if (err) {
                return res
                    .status(404)
                    .json(err)
            } else {
                return res
                    .status(200)
                    .json("Deleted")
            }
        })
}


const remove_part_investemt = (req, res, next) => {
    withdrawal.findByIdAndRemove(req.params.investmentId)
        .exec((err, assets) => {
            if (err) {
                return res
                    .status(404)
                    .json(err)
            } else {
                return res
                    .status(200)
                    .json("Deleted")
            }
        })
}


const load_account = async (req, res, next) => {

    const vest = {
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user_id,
        email: req.body.user_email,
        name: req.body.user_firstName,
        increament: req.body.increament,
        investmentId: nanoid(),
        paymentId: nanoid(),
        packageType: req.body.packageType,
        amount: req.body.amount,
        type: req.body.type,
        interval: req.body.interval,
        confirmation: 'confirmed',
        createdOn: req.body.loadDate
    }


    await new investments(vest).save(function (err, result) {
        if (err) {
            res
                .json({
                    message: err
                })
        }
        else {
            res
                .status(201)
                .json(result)
        }
    })
}

const send_withdrwal_confirmation_mail = async (req, res) => {
    withdrawal.findById(req.body._id).exec((err, iterm) => {
        if (!iterm) {
            res.status(404).json({
                message: "Account not found",
            });
            return;
        }
        if (req.body.confirmation) {
            (iterm.confirmation = req.body.confirmation)
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



module.exports = {
    read_all_investemtns,
    remove_part_investemt,
    read_user_investements,
    update_investment,
    remove_user_investemt,
    load_account,
    send_withdrwal_confirmation_mail
}