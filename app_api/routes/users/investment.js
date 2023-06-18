const express = require('express');
const router = express.Router();
const investments = require('../../controllers/user/investment');

const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ['HS256']
});

router
    .route('/investment')
    .get(auth, investments.get_user_invesments)
    .post(auth, investments.craete_investment);

router
    .route('/withdraw')
    .get(auth, investments.getwithdraw)
    .post(auth, investments.withdraw);

router
    .route('/investment/withdrawal')
    .get(auth, investments.get_user_withdrwals)

router
    .route('/withdraw/part')
    .get(auth, investments.get_user_part_withdrwals)



router
    .route('/investment/:investmentId')
    .patch(auth, investments.update_investment)
    .delete(auth, investments.delete_investment);

    router
    .route('/investment/part/:id')
    .delete(auth, investments.delete_part_withdrawal);
module.exports = router;