const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ['HS256']
});



const adminctrl = require('../../controllers/admin/investment')




/*
** Crypto Assets Routes
*/ 
router
    .route('/investment')
    .post(auth, adminctrl.load_account)
    .get(auth, adminctrl.read_all_investemtns)


router
    .route('/investment/user/:userId')
    .get(auth, adminctrl.read_user_investements)


router
    .route('/investments/:investmentId')
    .patch(auth, adminctrl.update_investment)
    .delete(auth, adminctrl.remove_user_investemt)

router  
    .route('/investments/part/:investmentId')
    .delete(auth, adminctrl.remove_part_investemt) 

router
    .route('/postMail')
    .patch(auth, adminctrl.send_withdrwal_confirmation_mail)




module.exports = router; 