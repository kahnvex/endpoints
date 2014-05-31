'use strict';

var create = require('./custom');

var Endpoints = {};

Endpoints.create = function(url) {
  return new create(url);
}

module.exports = Endpoints;
