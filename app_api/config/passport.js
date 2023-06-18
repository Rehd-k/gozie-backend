const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const users = mongoose.model('user');
const admin = mongoose.model('admin');


//crypto user
passport.use('users-local', new LocalStrategy({
    usernameField: 'email'
},
    (email, password, done) => {
        //shearch db for user
         let newIshMail = email.toLocaleLowerCase()
        users.findOne({
            email : newIshMail
        }, (err, user) => {
            if (err) {
                return done(err);
            }
            //if user not found 
            if (!user) {
                return done(null, false, {
                    message: 'User not found'
                });
            }
            // if password is worng
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Email or Password is incorrect'
                });
            }
            //if it reaches this end return a user 
            return done(null, user);
        })
            .catch((err) => {
                console.log(err)
            })
    }
));


// admin user passport config
passport.use('admin-local', new LocalStrategy({
    usernameField: 'userName'
},
    (userName, password, done) => {
        //shearch db for user
        admin.findOne({
            userName
        }, (err, user) => {
            if (err) {
                return done(err);
            }
            //if user not found 
            if (!user) {
                return done(null, false, {
                    message: 'User not found'
                });
            }
            // if password is worng
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Username or Password is incorrect'
                });
            }
            //if it reaches this end return a user 
            return done(null, user);
        })
            .catch((err) => {
                console.log(err)
            })
    }
));