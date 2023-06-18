const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ['HS256']
});


const paymentCtrl = require('../../../controllers/admin/general/info')


router
    .route('/payment')
    .post(auth, paymentCtrl.load_invesrmet)
    .get(paymentCtrl.read_investements)

router
    .route('/payment/:id')
    .patch(auth, paymentCtrl.update_investment)
    .delete(auth, paymentCtrl.remove_investemt)

module.exports = router;
