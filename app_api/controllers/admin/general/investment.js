const mongoose = require('mongoose');
const investments = mongoose.model('investmentSetting')


const load_invesrmet = (req, res, next) => {
    investments.create({
        _id: new mongoose.Types.ObjectId(),
        InvestmentType: req.body.InvestmentType,
        packageTypes: req.body.packageTypes,
        percentages: req.body.percentages,
        duration: req.body.duration,
        minValue: req.body.minValue,
        maxValue: req.body.maxValue,
        refBonus: req.body.refBonus
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
        iterm.InvestmentType = req.body.InvestmentType,
            iterm.packageTypes = req.body.packageTypes,
            iterm.percentages = req.body.percentages,
            iterm.duration = req.body.duration,
            iterm.minValue = req.body.minValue,
            iterm.maxValue = req.body.maxValue,
            iterm.refBonus = req.body.refBonus,
            iterm.save((err, iterm) => {
                if (err) {
                    res.status(404).json(err);
                } else {
                    res.status(200).json(iterm);
                }
            });
    });
}

const get_investemt = (req, res, next) => {
    investments.find()
        .exec((err, packages) => {
            if (err) {
                return res
                    .status(404)
                    .json(err)
            } else {
                return res
                    .status(200)
                    .json(packages)
            }
        })
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

const read_investement = (req, res, next) => {
    investments.findOne({
        packageTypes : req.params.id
})
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
    get_investemt ,
    update_investment,
    remove_investemt,
    read_investement
}

