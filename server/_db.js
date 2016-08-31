'use strict';

var Sequelize = require('sequelize');
var keys = require("../keys.json")

var databaseURI = keys.db.databaseURI;

var db = new Sequelize(databaseURI, {
  define: {
    timestamps: false,
    underscored: true
  }
});

module.exports = db;
