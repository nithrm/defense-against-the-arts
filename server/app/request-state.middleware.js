'use strict'; 

var router = require('express').Router();
var session = require('express-session');
var passport = require('passport');
var keys = require("../../keys.json")

var User = require('../api/users/user.model');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extend: ture}));
router.use(bodyParser.json());

router.use(session({
  secret: keys.rsMiddleware.secret,
  resave: false,
  saveUninitialized: false
}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
  .then(function (user) {
    done(null, user);
  })
  .catch(done);
});

router.use(passport.initialize());

router.use(passport.session());

module.exports = router;
