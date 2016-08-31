'use strict';

var router = require('express').Router();
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var keys = require("../../keys.json")

var User = require('../api/users/user.model');

router.get('/', passport.authenticate('github'));

router.get('/callback', passport.authenticate('github', {
  successRedirect: '/stories',
  failureRedirect: '/signup'
}));

passport.use(new GitHubStrategy({
  clientID: keys.github.clientID,
  clientSecret: keys.github.clientSecret,
  callbackURL: keys.github.callbackURL
}, function (token, refreshToken, profile, done) {
  var info = {
    name: profile.displayName,
    // github may not provide an email, if so we'll just fake it
    email: profile.emails ? profile.emails[0].value : [profile.username , 'fake-auther-email.com'].join('@'),
    photo: profile.photos ? profile.photos[0].value : undefined
  };
  User.findOrCreate({
    where: {githubId: profile.id},
    defaults: info
  })
  .spread(function (user) {
    done(null, user);
  })
  .catch(done);
}));

module.exports = router;
