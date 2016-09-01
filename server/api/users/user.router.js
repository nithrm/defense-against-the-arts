'use strict';

var router = require('express').Router();

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');
var Story = require('../stories/story.model');

router.param('id', function (req, res, next, id) {
  User.findById(id)
  .then(function (user) {
    if (!user) throw HttpError(404);
    req.requestedUser = user;
    next();
  })
  .catch(next);
});

router.get('/', function (req, res, next) {
  
  User.findAll({attributes: {exclude:["password","isAdmin","email", "googleId","twitterId","gitHub"]}})
  .then(function (users) {
    res.json(users);
  })
  .catch(next);
});

router.post('/', function (req, res, next) {
  if (!req.user.id) return 
  User.findById(req.user.id)
  .then(function(user){
    console.log("USER",user)
    if (!user.isAdmin){
      console.log("NOT ADMIN")
      return res.status(404).end();
    } else {
        User.create(req.body)
        .then(function (user) {
          user.dataValues.password = null;
          user.dataValues.email = null;
          res.status(201).json(user);
        })
        .catch(next);
     }
    })
});

router.get('/:id', function (req, res, next) {
  if (!req.user.id) return 
  User.findById(req.user.id)
  .then(function(user){
    console.log("USER",user)
    if (!user.isAdmin){
      console.log("NOT ADMIN")
      return res.status(404).end();
    } else {
      req.requestedUser.reload({include: [Story]})
      .then(function (requestedUser) {
        requestedUser.dataValues.password = null;
        requestedUser.dataValues.email = null;
        res.json(requestedUser);
      })
      .catch(next);
    }
  })
});

router.put('/:id', function (req, res, next) {
  req.requestedUser.update(req.body)
  .then(function (user) {
    user.dataValues.password = null;
    user.dataValues.email = null;
    res.json(user);
  })
  .catch(next);
});

router.delete('/:id', function (req, res, next) {
  if (!req.user.id) return 
  User.findById(req.user.id)
  .then(function(user){
    console.log("USER",user)
    if (!user.isAdmin){
      console.log("NOT ADMIN")
      return res.status(404).end();
    } else {
      req.requestedUser.destroy()
      .then(function () {
        res.status(204).end();
      })
      .catch(next);
    }
  })
  .catch(next);
});

module.exports = router;
