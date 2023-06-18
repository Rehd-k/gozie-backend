const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ['HS256']
});


const investmentsCtrl = require('../../../controllers/admin/general/investment')


router
    .route('/general/investment')
    .post(auth, investmentsCtrl.load_invesrmet)
    .get(investmentsCtrl.get_investemt)

router
    .route('/general/:id')
    .patch(auth, investmentsCtrl.update_investment) 
    .delete(auth, investmentsCtrl.remove_investemt)

router  
    .route('/general/getone/:id')
    .get(investmentsCtrl.read_investement)

module.exports = router;
