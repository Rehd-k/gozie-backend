const express = require('express');
const router = express.Router();
const adminctrl = require('../../controllers/admin/auth')

/*
 **  Register User
 */

 

router
    .route('/register')
    .post(adminctrl.register)


/*
 **  Login User
 */
router 
    .route('/login')
    .post(adminctrl.login)


/*
**  Get User
*/
router 
    .route('/getInfo')
    .get(adminctrl.getInfo)


/*
 **  Update User
 */
router
    .route('/update/:id')
    .patch(adminctrl.update_user)

module.exports = router;