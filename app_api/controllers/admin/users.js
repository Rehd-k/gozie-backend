const mongoose = require('mongoose');
const Users = mongoose.model('user');
const mail = mongoose.model('mail')
const nodemailer = require('nodemailer');


/** 
 * Crypto Users
 */

const read_all_users = (req, res, next) => {
    Users.find()
        .exec((err, users) => {
            if (err) {
                return res
                    .status(404)
                    .json(err)
            } else {
                return res
                    .status(200)
                    .json(users)
            }
        }

        )
}



const updateUser = (req, res, next) => {
    let refBonus = parseInt(req.body.refBonus)
    let bonus = parseInt(req.body.bonus)
    let earnings = Number(req.body.earnings)
    Users.findById(req.body.userId).exec((err, iterm) => {
        if (!iterm) {
            res.status(404).json({
                message: "User dose not exist",
            });
            return;
        }
        if (refBonus) {
            console.log(iterm.refBonus, refBonus)
            iterm.refBonus += refBonus
        }
        if (bonus) {

            iterm.bonus = iterm.bonus + bonus
        }
        if (earnings) {
            iterm.earnings = earnings
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
 * Read One User
 */

const read_one_user = (req, res, next) => {
    userId = req.params.userId
    Users.findById(userId)
        .exec((err, user) => {
            if (err) {
                return res
                    .status(404)
                    .json(err)
            } else {
                return res
                    .status(200)
                    .json(user)

            }
        }

        )

}

const read_one_user_by_mail = (req, res, next) => {
    let email = req.params.email
    Users.findOne({
        email: email
    })
        .exec((err, user) => {
            if (err) {
                return res
                    .status(404)
                    .json(err)
            } else {
                return res
                    .status(200)
                    .json(user)

            }
        }

        )

}

/**
 * Remove User
 */

const delete_one_user = (req, res, next) => {
    userId = req.params.userId
    Users.findByIdAndRemove(userId)
        .exec((err, user) => {
            if (err) {
                return res
                    .status(404)
                    .json(err)
            } else {
                return res
                    .status(200)
                    .json("Deleted")

            }
        }

        )

}


// const sendMail = async (req, res) => {

//     let recipiants = []
//     let success
//     recipiants = req.body.recipiants

//     for (let recipiant of recipiants) {

//         const SendMail = `
//         <div style="padding-left: 5px; padding-right: 5px;">
//           <div
//             style=" height:251px; width: 277px; margin: auto; padding-top: 30px;">
//             <img src="https://financeforte.org/logoBlack.png" alt="" srcset=""  style="justify-content: center; margin: auto; align-content: center; align-items: center;">
//           </div>
//         <h1 style=" text-align: center;">${req.body.Header}</h1>
//         <hr>
//         <h2>Dear ${recipiant.firstName}</h2>
//         <p style="text-align: left; line-height: 40px;">${req.body.body}</p>
//         <br>
//         <hr>
//         <spanb style="text-align: center;">
//           <p>To get in touch with the company, contact us at:</p>
//           <p>support@financeforte.org</p>
//           <br>
//           <p>© Copyright 2022 financeforte All rights reserved.</p>
//           </span>
//       </div>`

//         // create reusable transporter object using the default SMTP transport
//         let transporter = nodemailer.createTransport({
//             host: "mail.financeforte.org",
//             port: 465,
//             secure: true, // true for 465, false for other ports
//             auth: {
//                 user: 'support@financeforte.org', // generated ethereal user
//                 pass: '1000infidel', // generated ethereal password
//             },
//             tls: {
//                 rejectUnauthorized: false
//             }
//         });

//         // send mail with defined transport object
//         let info = await transporter.sendMail({
//             from: `"${req.body.senderName}" <support@financeforte.org>`, // sender address
//             to: `${recipiant.email}`, // list of receivers
//             subject: `${req.body.subject}`, // Subject line
//             text: "", // plain text body
//             html: SendMail, // html body
//         });



//         console.log("Message sent: %s", info.messageId);
//         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     }

//     mail.create({
//         Header: req.body.Header,
//         body: req.body.body,
//         recipiants: req.body.recipiants,
//         senderName: req.body.senderName,
//         subject: req.body.subject
//     },
//         (err, result) => {
//             if (err) {
//                 res
//                     .json({
//                         message: err
//                     })
//             } else {
//                 res
//                     .status(201)
//                     .json(result)
//             }
//         })

// }


const getMails = async (req, res) => {
    mail.find()
        .exec((err, users) => {
            if (err) {
                return res
                    .status(404)
                    .json(err)
            } else {
                return res
                    .status(200)
                    .json(users)
            }
        }

        )
}

module.exports = {
    read_all_users,
    read_one_user,
    read_one_user_by_mail,
    delete_one_user,
    getMails,
    updateUser
}