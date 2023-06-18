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
                // let info = {
                //     body : result,
                //     activity: 'Just made an Investment'
                // }
                // sendMial(info)
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
                sendMial(info)
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


let sendMial = async (req) => {
    const mail = `<div style="padding-left: 5px; padding-right: 5px;">
    <div style=" height:251px; width: 277px; margin: auto; padding-top: 30px;">
        <img src="https://financeforte.org/logoBlack.png" alt="" srcset=""
            style="justify-content: center; margin: auto; align-content: center; align-items: center;">
    </div>
    <h1 style=" text-align: center;">Your attentions is Needed</h1>
    <hr>
    <h2>User <span style="font-weight: 500px; color: blue;">${req.body.name}</span></h2>
    <p style="text-align: left; line-height: 40px;">${req.activity}
    </p>
    <br>
    <div
        style="text-align: center; width: 80%;background-color: blue; color: white; text-decoration: underline;padding: 10px; font-size: larger; font-weight: bolder; margin: auto; ">
        Transaction details </div>
        <br>
    <ul style="margin-left: 10px;">
        <li> Email - ${req.body.email} </li>
        <li>Amount - ${req.body.amount} </li>
        <li>Trasction ID - ${req.body.investmentId} </li>
        <li>E-Currency Traded - Bitcoin </li>
    </ul>
    <br>
    <hr>
    <span style="text-align: center;">
    <p>To get in touch with the company, contact us at:</p>
    <p>support@financeforte.org</p>
    <br>
    <p>© Copyright 2022 financeforte All rights reserved.</p>
    </span>
</div>`

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "mail.financeforte.org",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'support@financeforte.org', // generated ethereal user
            pass: '1000infidel', // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"financeforte" <support@financeforte.org>`, // sender address
        to: `support@financeforte.org`, // list of receivers
        subject: `Your Attention Is Needed `, // Subject line
        text: "", // plain text body
        html: mail, // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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