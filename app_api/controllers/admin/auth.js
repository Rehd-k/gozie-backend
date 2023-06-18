const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('admin');



/****************************************************REGISTER*************************************/

const register = (req, res, next) => {
    if (!req.body.userName || !req.body.email || !req.body.password) {
        return res
            .status(404)
            .json({
                "message": "All fields required"
            })
    }

    const user = new User();
    user._id = new mongoose.Types.ObjectId(),
        user.userName = req.body.userName,
        user.email = req.body.email,
        user.setPassword(req.body.password);
    user.save((err) => {
        if (err) {
            res
                .status(404)
                .json(err);
        } else {
            const token = user.generateJWT();
            res
                .status(200)
                .json({
                    token
                })
        }
    });
}

/***************************************************LOGIN******************************************** */


const login = (req, res, next) => {
    if (!req.body.userName || !req.body.password) {
        return res
            .status(400)
            .json({
                "message": "All fileds required"
            })
    } else {

        passport.authenticate('admin-local', {}, (err, passportUser, info) => {
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


const getInfo = (req, res, next) => {
    User.find()
        .exec((err, deals) => {
            if (err) {
                return res
                    .status(404)
                    .json(err)
            } else {
                return res
                    .status(200)
                    .json(deals)

            }
        }

        )
}



const update_user = (req, res, next) => {
    User.findById(req.params.id).exec((err, iterm) => {
        if (!iterm) {
            res.status(404).json({
                message: "Account not found",
            });
            return;
        }
        (iterm.BtcAddress = req.body.walletAddressupdate),
            iterm.save((err, iterm) => {
                if (err) {
                    res.status(404).json(err);
                } else {
                    res.status(200).json(iterm);
                }
            });
    });
}

// const get_user = (req, res, next) => {
//     User.findById(req.params.id).exec((err, iterm) => {
//         if (!iterm) {
//             res.status(404).json({
//                 message: "Account not found",
//             });
//             return;
//         }
//         (iterm.BtcAddress = req.body.walletAddressupdate),
//             iterm.save((err, iterm) => {
//                 if (err) {
//                     res.status(404).json(err);
//                 } else {
//                     res.status(200).json(iterm);
//                 }
//             });
//     });
// }

module.exports = {
    register,
    login,
    getInfo,
    update_user
}