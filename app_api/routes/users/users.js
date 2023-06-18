let express = require('express');
let router = express.Router();
const jwt = require('express-jwt');
const multer = require('multer')
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
  algorithms: ['HS256']
});

const uploadIterms = multer({ dest: "profilePic/" });

const User = require('../../controllers/user/user')




/* POST  create new users. */
router
  .route('/register')
  .post(User.register)

/* POST login */
router
  .route('/login')
  .post(User.login)



/* PUT & DELETE update users */
router
  .route('/findOne')
  .patch(auth, uploadIterms.single("images"), auth, User.update_user)
  .delete(auth, User.delete_user)

router
  .route('/updatePassword')
  .patch(User.update_password)

router
  .route('/send_reset_mail')
  .post(User.send_mail_reset)



/* GET User profile */
router
  .route('/profile')
  .get(auth, User.get_profile)

router
  .route('/profile/ref/:refId')
  .get(auth, User.get_referals)


module.exports = router;