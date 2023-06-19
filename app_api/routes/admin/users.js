const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ['HS256']
});



const adminctrl = require('../../controllers/admin/users')



/*
 **  Crypto Routes
 */
router
    .route('/users')
    .get(auth, adminctrl.read_all_users)



router
    .route('/user/:userId')
    .get(auth, adminctrl.read_one_user)
    .delete(auth, adminctrl.delete_one_user)


router
    .route('/user/email/:email')
    .get(auth, adminctrl.read_one_user_by_mail)



router
    .route('/sendMail')
    // .post(auth, adminctrl.sendMail)
    .get(auth, adminctrl.getMails)

router
    .route('/updateUser')
    .patch(auth, adminctrl.updateUser)


module.exports = router;