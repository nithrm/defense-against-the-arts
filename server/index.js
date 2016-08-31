'use strict';

var app = require('./app');
var db = require('./db');
var keys = require("../keys.json")

var port = keys.db.port;
var server = app.listen(port, function (err) {
  if (err) throw err;
  console.log('HTTP server patiently listening on port', port);
  db.sync()
  .then(function () {
    console.log('Oh and btw the postgres server is totally connected, too');
  });
});

module.exports = server;
