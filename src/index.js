'use strict';

var create = require('./create');

var Endpoints = {};

Endpoints.create = function(url) {
  return new create(url);
}

module.exports = Endpoints;
