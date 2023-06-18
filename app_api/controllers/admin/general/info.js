const mongoose = require('mongoose');
const investments = mongoose.model('paymentSetting')


const load_invesrmet = (req, res, next) => {
    investments.create({
        _id: new mongoose.Types.ObjectId(),
        coinName: req.body.coinName,
        WalletAddress: req.body.WalletAddress,
        Network: req.body.Network
    }, (err, result) => {
        if (err) {
            res
                .json({
                    message: err
                })
        } else {
            res
                .status(201)
                .json(result)
        }
    });
}



const update_investment = (req, res, next) => {
    investments.findById(req.params.id).exec((err, iterm) => {
        if (!iterm) {
            res.status(404).json({
                message: "Stuff not found",
            });
            return;
        }
        iterm.coinName = req.body.coinName,
            iterm.WalletAddress = req.body.WalletAddress,
            iterm.Network = req.body.Network,
            iterm.save((err, iterm) => {
                if (err) {
                    res.status(404).json(err);
                } else {
                    res.status(200).json(iterm);
                }
            });
    });
}

const remove_investemt = (req, res, next) => {
    investments.findByIdAndRemove(req.params.id)
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

const read_investements = (req, res, next) => {
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

module.exports = {
    load_invesrmet,
    update_investment,
    remove_investemt,
    read_investements
}

