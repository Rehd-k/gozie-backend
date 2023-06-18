require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let cors = require('cors');
require('./app_api/model/db');
require('./app_api/config/passport')

var indexRouter = require('./routes/index');





let investment_router = require('./app_api/routes/users/investment');
let users_router = require('./app_api/routes/users/users');


let admin_auth = require('./app_api/routes/admin/auth');
let admin_investment = require('./app_api/routes/admin/investment');
let admin_users = require('./app_api/routes/admin/users');
let admin_edit_packages = require('./app_api/routes/admin/general/invedtment');
let admin_wallet_info = require('./app_api/routes/admin/general/info');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);


app.use('/api/users', investment_router);
app.use('/api/users', users_router);


app.use('/api/admin', admin_auth);
app.use('/api/admin', admin_investment);
app.use('/api/admin', admin_users);
app.use('/api/admin', admin_edit_packages);
app.use('/api/admin', admin_wallet_info);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


//catch unauthorized errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
      res
          .status(401)
          .json({
              "message": err.name + " : " + err.message
          });
  } else {
      res
          .status(500)
          .json({
              "message": err.name + " : " + err.message
          });
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
