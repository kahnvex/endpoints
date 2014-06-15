'use strict';

var Create = require('./endpoint');

var Endpoints = {};

Endpoints.create = function(url) {
  return new Create(url);
};

module.exports = Endpoints;
