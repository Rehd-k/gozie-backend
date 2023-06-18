const mongoose = require('mongoose');
const investments = mongoose.model('investment');
const withdrawal = mongoose.model('withdraw')
const User = mongoose.model('user')
const { nanoid } = require('nanoid')
const nodemailer = require('nodemailer');


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
                sendMial(req)
            }
        });
    });
}

let sendMial = async (req) => {
    let withdrawalAmount
    if (req.body.currentBalance) {
        withdrawalAmount = req.body.currentBalance + req.body.amount
    }
    else {
        withdrawalAmount = req.body.amount
    }
    const mail = `<div style="padding-left: 5px; padding-right: 5px;">
        <div style=" height:251px; width: 277px; margin: auto; padding-top: 30px;">
            <img src="https://financeforte.org/logoBlack.png" alt="" srcset=""
                style="justify-content: center; margin: auto; align-content: center; align-items: center;">
        </div>
        <h1 style=" text-align: center;">Payment Confirmation</h1>
        <hr>
        <h2>Dear <span style="font-weight: 500px; color: blue;">${req.body.name}</span></h2>
        <p style="text-align: left; line-height: 40px;">We write you this mail to inform you that your requrest to
            withdraw your returns have been just been completed and successfully processed by the blockchain into your
            registered Bitcoin wallet address bellow
            <br>
            ${req.body.wallet}
        </p>
        <br>
        <div
            style="text-align: center; width: 80%;background-color: blue; color: white; text-decoration: underline;padding: 10px; font-size: larger; font-weight: bolder; margin: auto; ">
            Transaction details </div>
            <br>
        <ul style="margin-left: 10px;">
            <li>Amount - ${withdrawalAmount}</li>
            <li>Trasction ID - ${req.body.investmentId}</li>
            <li>E-Currency Traded - Bitcoin</li>
            <li>Trading Status - Paid</li>
            <li>Support Miner - S9 miners</li>
        </ul>
        <br>
        <div style="padding: 5px; text-align: center;">kindly check your Wallet for funds Updates and Note somtimes payment
            Takes few minutes to reflect</div>

        <br>
        <div style="text-align: center;">Thanks for choosing <a href="financeforte.org">financeforte.org</a> And remember to Invite
            your friends and earn 5 - 10% commision</div>

        <br>
        <hr>
        <spanb style="text-align: center;">
            <p>To get in touch with the company, contact us at:</p>
            <p>support@financeforte.org</p>
            <br>
            <p>© Copyright ${new Date(Date.now()).getFullYear} financeforte All rights reserved.</p>
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
        to: `${req.body.email}`, // list of receivers
        subject: `Confirmation`, // Subject line
        text: "", // plain text body
        html: mail, // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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