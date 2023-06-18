const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const withdrawal = mongoose.model('withdraw')
const { nanoid } = require('nanoid')
const cloudinary = require("cloudinary").v2;
const nodemailer = require('nodemailer');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});


const register = async (req, res, next) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
        return res
            .status(404)
            .json({
                "message": "All fields required"
            })
    }
    const user = new User();
    user._id = new mongoose.Types.ObjectId(),
        user.firstName = req.body.firstName,
        user.lastName = req.body.lastName,
        user.phoneNumber = req.body.phoneNumber,
        user.email = req.body.email.toLowerCase(),
        user.refCode = nanoid(10),
        user.refererId = req.body.refId,
    user.setPassword(req.body.password);
    user.save(async (err) => {
        if (err) {
            res
                .status(404)
                .json(err);
        } else {
            const token = user.generateJWT();
            genMail(req.body)
            res
                .status(200)
                .json({
                    token
                })
        }
    });
}



const login = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({
                "message": "All fileds required"
            })
    } else {

        passport.authenticate('users-local', {}, (err, passportUser, info) => {
            let token;
            if (err) {
                return res
                    .status(404)
                    .json(err)
            }
            if (passportUser) {
                token = passportUser.generateJWT();
                return res
                    .status(200)
                    .json({
                        token
                    });
            } else {
                res
                    .status(401)
                    .json(info)
            }
        })(req, res, next);
    }

};

const get_referals = (req, res, next) => {
    let referals = req.params.refId
    User.find({
        refererId: referals
    })
        .select(['-hash', '-salt', '-refCode', '-refererId'])
        .exec((err, users) => {
            if (err) {
                res
                    .status(404)
                    .json({
                        message: err
                    })
            } else {
                res
                    .status(200)
                    .json(users)

            }
        })

}



const get_profile = (req, res) => {

    if (!req.payload.email) {
        res
            .status(404)
            .json({
                "message": "UnauthorizedError : Private profile"
            })
    } else {
        User
            .findOne({
                email: req.payload.email
            })
            .select(['-hash', '-salt', '-createdOn'])
            .exec((err, user) => {
                if (err) {
                    res
                        .status(404)
                        .json(err)
                    return;
                } else {
                    res
                        .status(201)
                        .json(user)
                }
            })

    }
}

const update_user = async (req, res, next) => {
    let images

    if (req.file) {
        let image = await cloudinary.uploader.upload(req.file.path);
        images = {
            url: image.secure_url,
            public_id: image.public_id,
        };
    }

    console.log(images)

    User.findById(req.payload._id).exec((err, iterm) => {
        if (!iterm) {
            res.status(404).json({
                message: "User dose not exist",
            });
            return;
        }
        if (req.body.firstName) {
            iterm.firstName = req.body.firstName
        }

        if (req.body.email) {
            iterm.email = req.body.email
        }
        if (req.body.walletAddress) {
            iterm.walletAddress = req.body.walletAddress
        }
        if (req.body.phoneNumber) {
            iterm.phoneNumber = req.body.phoneNumber
        }
        if (images) {
            iterm.profilePicture = images
        }
        if (req.body.refBonus) {
            iterm.refBonus -= req.body.refBonus

            let reqq = {
                info: iterm,
                bonus: req.body.refBonus,
                refString: 'ref. Bonus',
                confirmation: 'pending withdraw',
                wallet: req.body.wallet
            }
            withdraw(reqq, res)
        }
        if (req.body.bonus) {
            iterm.bonus -= req.body.bonus
            let reqq = {
                info: iterm,
                bonus: req.body.bonus,
                refString: 'Bonus',
                confirmation: 'pending withdraw',
                wallet: req.body.wallet
            }
            withdraw(reqq, res)
        }
        if (req.body.password) {
            iterm.setPassword(req.body.password);
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

const withdraw = (reqq, res) => {
    withdrawal.create({
        _id: new mongoose.Types.ObjectId(),
        user: reqq.info._id,
        investmentId: reqq.refString,
        amount: reqq.bonus,
        wallet: reqq.wallet,
        name: reqq.info.firstName,
        email: reqq.info.email,
        confirmation: reqq.confirmation
    },
        (err, result) => {

        })
}

const send_mail_reset = async (req, res) => {
    User.findOne({ email: req.body.email }).exec((err, iterm) => {
        if (!iterm) {
            res.status(404).json({
                message: "User dose not exist",
            });
            return;
        }
        genPasswordMail(iterm)
        res.status(200)
        res.json({ message: 'success' })
    }
    )
}


const update_password = async (req, res, next) => {
    User.findOne({ email: req.body.email }).exec((err, iterm) => {
        if (!iterm) {
            res.status(404).json({
                message: "User dose not exist",
            });
            return;
        }
        iterm.setPassword(req.body.password);
        iterm.save((err, iterm) => {
            if (err) {
                res.status(404).json(err);
            } else {
                res.status(200).json(iterm);
            }
        });
    });
}

const delete_user = (req, res, next) => {
    userId = req.params.userId
    if (userId) {
        User.findByIdAndRemove(userId).exec((err) => {
            if (err) {
                res.status(404).json(err);
                return;
            }
            res.status(201).json({
                message: "Deleted"
            });
        });
    } else {
        res.status(404).json({
            message: "No user proparty",
        });
    }
}




async function genPasswordMail(user) {

    const The_mail = `<div style="padding-left: 5px; padding-right: 5px;">
    <div style=" height:251px; width: 277px; margin: auto; padding-top: 30px;">
        <img src="https://financeforte.org/logoBlack.png" alt="" srcset=""
            style="justify-content: center; margin: auto; align-content: center; align-items: center;">
    </div>
    <h1 style=" text-align: center;">Email Reset</h1>
    <hr>
    <h2 style="font-size: xx-large;">Hello,</h2>
    <p style="text-align: left; line-height: 40px;">You are receiving this email because we received a passwowrd
        reset request for you account
        <br>
        <button
            style="padding:10px; margin: auto; background-color: black; display: grid; place-items: center; border-radius: 5px; color: white;"><a href="https://financeforte.org/update-password/${user._id}?user=${user.email}">Reset
            Password</a></button>
        <br>
        This password reset link will expire in 60 minutes.
        <br>
        If you did not reequest a passwowrd reset, no further action is required.
        <br>
    <p>Regards,</p>
    <p>financeforte</p>
    </p>
    <br>

    <div style="text-align: center;">Thanks for choosing <a href="https://financeforte.org/">financeforte</a> And remember to Invite
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
        from: '"financeforte" <support@financeforte.org>', // sender address
        to: user.email, // list of receivers
        subject: "Password Reset", // Subject line
        text: "", // plain text body
        html: The_mail, // html body
    });

    console.log("Message sent: %s", info);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}


const genMail = async (user) => {

    const SendMail = `
        <div style="padding-left: 5px; padding-right: 5px;">
          <div
            style=" height:251px; width: 277px; margin: auto; padding-top: 30px;">
            <img src="https://financeforte.org/logoBlack.png" alt="" srcset=""  style="justify-content: center; margin: auto; align-content: center; align-items: center;">
          </div>
        <h1 style=" text-align: center;">Congratulations</h1>
        <hr>
        <h2>Dear ${user.firstName}</h2>
        <p style="text-align: left; line-height: 40px;">Your have successfully registered with financeforte <br>
        Visit your profile page, enter and start your journey to success. Thank you 
        Email: ${user.email}<br>
        Ref-code: ${user.refCode}<br>
        ${user.walletAddress ? `Wallet Address: ${user.walletAddress}` : ''}

        </p>
        <br>
        <hr>
        <span style="text-align: center;">
          <p>To get in touch with the company, contact us at:</p>
          <p>support@financeforte.org</p>
          <br>
          <p>© Copyright ${new Date(Date.now()).getFullYear} financeforte All rights reserved.</p>
          </span>
      </div>`

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "financeforte.org",
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
        to: `${user.email}`, // list of receivers
        subject: `Registration Confirmation`, // Subject line
        text: "", // plain text body
        html: SendMail, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}





module.exports = {
    register,
    login,
    get_profile,
    delete_user,
    update_user,
    get_referals,
    send_mail_reset,
    update_password
}